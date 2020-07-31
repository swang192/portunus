from urllib import parse

from django.http import HttpResponse
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import logout as logout_user
from django.shortcuts import redirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK

from authentication.utils import blacklist_user_tokens, is_valid_redirect_url
from shared import frontend_urls


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    content = {"email": request.user.email}
    return Response(content)


@ensure_csrf_cookie
@require_GET
def set_csrf(request):
    return HttpResponse("success", status=HTTP_200_OK)


@api_view(["GET"])
def logout(request):
    if request.user.is_authenticated:
        blacklist_user_tokens(request.user)
    logout_user(request)

    query_params = request.query_params

    logout_next = query_params.get("logoutNext")
    if is_valid_redirect_url(logout_next):
        return redirect(logout_next)

    query_string = ""
    if query_params:
        query_string = f"?{parse.urlencode(query_params)}"
    return redirect(f"{frontend_urls.LOGIN}{query_string}")
