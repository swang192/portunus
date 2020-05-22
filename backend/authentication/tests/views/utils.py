from django.conf import settings
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

from authentication.utils import REFRESH_TOKEN_SESSION_KEY


def assert_successful_response(response, redirect_url):
    assert response.status_code == 200
    assert response.json()["next"] == (redirect_url or settings.DEFAULT_REDIRECT_URL)


def assert_authenticated(client):
    assert REFRESH_TOKEN_SESSION_KEY in client.session
    RefreshToken(client.session[REFRESH_TOKEN_SESSION_KEY])
    result = client.post(
        reverse("authentication:token_refresh"), content_type="application/json"
    )
    assert result.status_code == 200
    assert "access" in result.json()


def assert_failure_response(response):
    assert response.status_code == 400


def assert_unauthenticated(client):
    assert REFRESH_TOKEN_SESSION_KEY not in client.session
    result = client.post(
        reverse("authentication:token_refresh"), content_type="application/json"
    )
    assert result.status_code == 400
    assert "access_code" not in result.json()
