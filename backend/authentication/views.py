from django.contrib.auth import authenticate, logout as logout_user
from django.http import HttpResponse
from django.views.decorators.http import require_POST
from rest_framework import status
from rest_framework_simplejwt.views import TokenRefreshView as SimpleJWTTokenRefreshView

from .models import User
from .utils import login_user, REFRESH_TOKEN_SESSION_KEY


@require_POST
def register(request):
    user = User.objects.create_user(
        email=request.POST.get("email"), password=request.POST.get("password"),
    )
    login_user(request, user)
    return HttpResponse("success", status=status.HTTP_200_OK)


@require_POST
def login(request):
    user = authenticate(
        username=request.POST.get("username"), password=request.POST.get("password")
    )

    login_user(request, user)
    return HttpResponse("success", status=status.HTTP_200_OK)


@require_POST
def logout(request):
    logout_user(request)
    return HttpResponse("success", status=status.HTTP_200_OK)


class TokenRefreshView(SimpleJWTTokenRefreshView):
    """
    Pulls the refresh type JSON web token from the user session and returns an
    access type JSON web token if the refresh token is valid.
    """

    def get_serializer(self, *args, **kwargs):
        kwargs["data"] = dict(kwargs["data"])
        kwargs["data"]["refresh"] = self.request.session.get(REFRESH_TOKEN_SESSION_KEY)
        return super().get_serializer(*args, **kwargs)
