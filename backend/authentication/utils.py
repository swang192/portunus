from rest_framework_simplejwt.tokens import RefreshToken

from .models import User

REFRESH_TOKEN_SESSION_KEY = "refresh_token"


def login_user(request, user):
    refresh = RefreshToken.for_user(user)
    request.session[REFRESH_TOKEN_SESSION_KEY] = str(refresh)


def create_user(portunus_uuid):
    User.objects.create_user(portunus_uuid=portunus_uuid)
