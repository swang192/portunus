import json
from contextlib import suppress
from datetime import datetime
from calendar import timegm

from django.contrib.auth.signals import user_login_failed
from django.views.decorators.http import require_POST
from django.core.exceptions import ValidationError
from rest_framework import filters, status
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveDestroyAPIView
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView as SimpleJWTTokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import permission_classes, api_view
from django.core.validators import validate_email
from sentry_sdk import capture_exception, configure_scope

from authentication.utils import blacklist_user_tokens, make_authenticated_response
from mfa.serializers import CodeLoginSerializer
from mfa.utils import mfa_token_generator
from shared.utils.logging import log_event, log_view_outcome

from .serializers import (
    RegistrationSerializer,
    LoginSerializer,
    UserSerializer,
    LoginUsingRegisterSerializer,
)
from .models import User
from .utils import (
    login_user,
    REFRESH_TOKEN_SESSION_KEY,
    check_and_change_password,
    check_onetime_token,
    check_change_email_token,
    make_response,
    check_password_for_auth_change,
)
from .errors import (
    AUTH_FAILURE,
    INVALID_TOKEN,
    INVALID_EMAIL,
    EMAIL_EXISTS,
    STAFF_RESTRICTED_ACTION,
)
from shared.email import PortunusMailer
from shared.permissions import IsSameUserOrAdmin, IsSameUserOrSuperuser

SEARCH_FIELDS = ["email"]
MIN_SEARCH_LENGTH = 5
MAX_SEARCH_RESULTS = 20


@log_view_outcome()
@require_POST
def login_with_mfa_code(request):
    data = json.loads(request.body)
    serializer = CodeLoginSerializer(data=data)

    if not serializer.is_valid():
        # If the request is invalid, we need to send this signal so that axes
        # can lock the user out after five failed attempts. The user property
        # on the serializer will always be set if the mfa_token is valid - if
        # it is not valid, then the code is not checked so we don't need to
        # send the signal.
        if serializer.user:
            credentials = {"email": serializer.user.email, "code": data.get("code")}
            user_login_failed.send(sender=__name__, credentials=credentials, request=request)
        first_errors = {k: v[0] for k, v in serializer.errors.items()}
        return make_response(False, first_errors)

    login_user(request, serializer.user)
    return make_authenticated_response(data)


def make_auth_view(*serializer_classes, action, show_errors=True):
    """
    Creates a view from an ordered list of serializers. If any serializer is valid with the
    given data, log the user in and redirect them to the given URL.
    """

    @log_view_outcome(event_type=action)
    @require_POST
    def view(request):
        data = json.loads(request.body)

        for serializer_class in serializer_classes:
            serializer = serializer_class(data=data, context={"request": request})
            if serializer.is_valid():
                break

        if not serializer.is_valid():
            first_serializer = serializer_classes[0](data=data, context={"request": request})
            first_serializer.is_valid()
            first_errors = {k: v[0] for k, v in first_serializer.errors.items()}

            if not show_errors and "email" in first_errors:
                del first_errors["email"]

                # If that's the only problem with the form, give a generic response
                if len(first_errors.keys()) == 0:
                    first_errors = {
                        api_settings.NON_FIELD_ERRORS_KEY: LoginSerializer.bad_credentials_error,
                    }

            return make_response(False, first_errors)

        user = serializer.save()

        mfa_method = user.mfa_methods.filter(is_primary=True).first()
        if mfa_method:
            mfa_method.send_code()
            data = {
                "mfa_required": True,
                "mfa_method": mfa_method.type,
                "ephemeral_token": mfa_token_generator.make_token(user),
            }
            return make_response(True, data)

        login_user(request, user)
        return make_authenticated_response(data)

    return view


register = make_auth_view(
    RegistrationSerializer, LoginUsingRegisterSerializer, action="register", show_errors=False
)
login = make_auth_view(LoginSerializer, action="login")


@log_view_outcome()
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    password = request.data.get("password")
    new_password = request.data.get("new_password")

    response = check_password_for_auth_change(request, user, password)
    if response is not None:
        return response

    return check_and_change_password(request, user, new_password)


@log_view_outcome()
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def request_email_change(request):
    user = request.user
    password = request.data.get("password")
    new_email = request.data.get("new_email")

    if user.is_staff:
        return make_response(False, {"error": STAFF_RESTRICTED_ACTION})

    response = check_password_for_auth_change(request, user, password)
    if response is not None:
        return response

    try:
        validate_email(new_email)
        existing_user = User.objects.filter(email=request.data["new_email"]).first()
        if existing_user:
            return make_response(False, {"error": EMAIL_EXISTS})
    except ValidationError:
        return make_response(False, {"error": INVALID_EMAIL})

    PortunusMailer.send_change_email_confirmation(user, new_email)
    return make_response()


@log_view_outcome()
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_email(request):
    user = request.user
    token = request.data.get("token")
    new_email = request.data.get("new_email")

    if not check_change_email_token(token, user):
        return make_response(False, {"error": INVALID_TOKEN})

    serializer = UserSerializer(instance=user, data={"email": new_email})

    if not serializer.is_valid():
        return make_response(False, {"error": INVALID_EMAIL})
    serializer.save()

    return make_response()


@api_view(["POST"])
def request_password_reset(request):
    email = request.data.get("email")
    if not email:
        return make_response(False)

    try:
        user = User.objects.get(email=email.lower())
    except User.DoesNotExist:
        # Send back success even if the account DNE to avoid leaking user emails.
        extra_data = {
            "success": False,
            "email": email,
            "error": "Matching user does not exist",
        }
        log_event("request_password_reset", request, extra_data=extra_data)
        return make_response()

    PortunusMailer.send_password_reset(user)
    log_event("request_password_reset", request, extra_data={"success": True})
    return make_response()


@api_view(["POST"])
@permission_classes([IsAdminUser])
def admin_request_password_reset(request):
    portunus_uuid = request.data.get("portunus_uuid")
    if not portunus_uuid:
        return make_response(False)

    try:
        user = User.objects.get(portunus_uuid=portunus_uuid)
    except User.DoesNotExist:
        return make_response(False)

    PortunusMailer.send_password_reset(user)
    return make_response()


@log_view_outcome()
@api_view(["POST"])
def reset_password(request):
    uid = request.data.get("portunus_uuid")
    token = request.data.get("token")
    new_password = request.data.get("new_password")

    try:
        user = User.objects.get(portunus_uuid=uid)
    except User.DoesNotExist:
        return make_response(False, {"error": AUTH_FAILURE})
    except ValidationError:
        return make_response(False)

    if not check_onetime_token(token, user):
        return make_response(False, {"error": INVALID_TOKEN})

    return check_and_change_password(request, user, new_password)


class TokenRefreshView(SimpleJWTTokenRefreshView):
    """
    Pulls the refresh type JSON web token from the user session and returns an
    access type JSON web token if the refresh token is valid. Also updates the
    refresh token in the user session if ROTATE_REFRESH_TOKENS is True.
    """

    def get_serializer(self, *args, **kwargs):
        kwargs["data"] = dict(kwargs["data"])
        kwargs["data"]["refresh"] = self.request.session.get(REFRESH_TOKEN_SESSION_KEY)
        return super().get_serializer(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        refresh = self.request.session.get(REFRESH_TOKEN_SESSION_KEY)
        if refresh:
            try:
                RefreshToken(refresh)
            except Exception as e:
                with configure_scope() as scope:
                    with suppress(Exception):
                        scope.set_extra(
                            "token_payload", repr(RefreshToken(refresh, verify=False))
                        )
                        scope.set_extra(
                            "now_timestamp", timegm(datetime.utcnow().utctimetuple())
                        )
                    capture_exception(e)

        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        if "refresh" in serializer.validated_data:
            self.request.session[REFRESH_TOKEN_SESSION_KEY] = serializer.validated_data[
                "refresh"
            ]
            del serializer.validated_data["refresh"]

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class ListCreateUsersView(ListCreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer
    renderer_classes = [JSONRenderer]

    def get_queryset(self):
        uuids = self.request.GET.getlist("portunus_uuids")

        if uuids:
            return User.objects.filter(portunus_uuid__in=uuids)

        return User.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.create(request.data)
            return make_response(
                True, {"portunus_uuid": str(user.portunus_uuid)}, renderer=JSONRenderer
            )
        else:
            existing_user = User.objects.filter(email=request.data["email"]).first()
            data = serializer.errors

            if existing_user:
                data["portunus_uuid"] = str(existing_user.portunus_uuid)
                data["user_exists"] = True

            return make_response(False, data, renderer=JSONRenderer)


class SearchUsersView(ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer
    renderer_classes = [JSONRenderer]
    filter_backends = [
        filters.SearchFilter,
    ]
    search_fields = SEARCH_FIELDS

    def get_queryset(self):
        search = self.request.query_params.get("search")

        # require a minimum search string length to get results
        if search and len(search) >= MIN_SEARCH_LENGTH:
            return User.objects.all()

        return User.objects.none()

    def dispatch(self, request, *args, **kwargs):
        """limit the number of results that can be returned"""
        http_response = super().dispatch(request, *args, **kwargs)
        json_response = http_response.data
        http_response.data = json_response[:MAX_SEARCH_RESULTS]
        return http_response


class RetrieveDeleteUserView(RetrieveDestroyAPIView):
    serializer_class = UserSerializer
    lookup_field = "portunus_uuid"
    queryset = User.objects.all()

    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        blacklist_user_tokens(user)
        return self.destroy(request, *args, **kwargs)

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsSameUserOrAdmin()]
        return [IsSameUserOrSuperuser()]


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_current_user_settings(request):
    # TODO add social auth settings and link in the frontend.
    # TODO use a serializer for this when adding new fields.
    return make_response(data={"email": request.user.email})


@api_view(["POST"])
def send_new_user_email(request):
    uuid = request.data.get("portunus_uuid")
    if not uuid:
        return make_response(False)

    try:
        user = User.objects.get(portunus_uuid=uuid)
    except User.DoesNotExist:
        # Send back success even if the account DNE to avoid leaking uuids.
        return make_response()

    PortunusMailer.send_account_creation_notice(user)
    return make_response()
