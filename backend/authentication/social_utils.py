from django.conf import settings
import requests
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from .models import User

VALID_GOOGLE_ISSUERS = ["accounts.google.com", "https://accounts.google.com"]


def is_valid_existing_account(user, provider):
    # Google addresses are verified, so we
    #   accept a response from them as good
    #   no matter what.
    if provider == User.PROVIDER_GOOGLE:
        return True

    # If the user hasn't logged in with oauth
    #   before, they can't now since the email
    #   might not be verified.
    if not user.social_login_provider:
        return False

    # If the user is logging in with the provider
    #   that is attached to their account, then
    #   let them proceed.
    return provider == user.social_login_provider


def _get_facebook_access_token():
    return (
        requests.get(
            "https://graph.facebook.com/v3.0/oauth/access_token",
            params={
                "client_id": settings.FACEBOOK_CLIENT_ID,
                "client_secret": settings.FACEBOOK_CLIENT_SECRET,
                "grant_type": "client_credentials",
            },
        )
        .json()
        .get("access_token")
    )


def _is_valid_facebook_token(token, email):
    # Ensure the token was generated for our app.
    res = requests.get(
        "https://graph.facebook.com/v3.0/debug_token",
        params={"input_token": token, "access_token": _get_facebook_access_token(),},
    )

    if not res.ok or res.json().get("error") is not None:
        return False

    # Make sure the token and email address supplied match.
    res = requests.get(
        "https://graph.facebook.com/v3.0/me",
        params={"fields": "email", "access_token": token,},
    )

    return res.ok and res.json().get("email") == email


def _is_valid_google_token(token, email):
    try:
        idinfo = id_token.verify_oauth2_token(
            token, google_requests.Request(), settings.GOOGLE_APP_ID
        )
    except ValueError:
        return False

    if idinfo.get("iss") not in VALID_GOOGLE_ISSUERS:
        return False

    token_email = idinfo.get("email")
    return token_email and token_email == email


PROVIDER_TOKEN_CHECKS = {
    User.PROVIDER_GOOGLE: _is_valid_google_token,
    User.PROVIDER_FACEBOOK: _is_valid_facebook_token,
}


def is_valid_token(email, token, provider):
    if not email and token and provider:
        return False

    if provider not in PROVIDER_TOKEN_CHECKS:
        return False

    if not PROVIDER_TOKEN_CHECKS[provider](token, email):
        return False

    return True
