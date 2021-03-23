from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated

from authentication.utils import make_response
from mfa import serializers


class MfaMethodView(GenericAPIView):
    permission_classes = (IsAuthenticated,)
    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):
        data = request.data
        data.update({"mfa_method": kwargs.get("mfa_method")})
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return make_response()


class RequestMfaMethodActivationView(MfaMethodView):
    serializer_class = serializers.RequestMfaActivationSerializer


class ConfirmMfaMethodActivationView(MfaMethodView):
    serializer_class = serializers.MfaActivationConfirmationSerializer


class ConfirmMfaMethodDeactivationView(MfaMethodView):
    serializer_class = serializers.MfaDeactivationConfirmationSerializer


class SendMfaCodeView(MfaMethodView):
    serializer_class = serializers.SendMfaCodeSerializer


class SendMfaCodeUsingTokenView(MfaMethodView):
    serializer_class = serializers.SendMfaCodeUsingTokenSerializer
    permission_classes = []


class MfaMethodsListView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.MfaMethodSerializer

    def get_queryset(self):
        return self.request.user.mfa_methods.filter(is_active=True)
