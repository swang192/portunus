from unittest.mock import patch, Mock

import pytest
from django.urls import reverse

from authentication.factories import UserFactory
from authentication.models import User
from authentication.social_utils import VALID_GOOGLE_ISSUERS
from .utils import assert_unauthenticated

pytestmark = [pytest.mark.django_db]

USER_EMAIL = "user@test.com"
VALID_PASSWORD = "test_password123"
INVALID_PASSWORD = "wrong_password123"
TEST_TOKEN = "test_token"

USER_DATA = {
    "email": USER_EMAIL,
    "password": VALID_PASSWORD,
}

GOOGLE_USER_DATA = {
    "email": USER_EMAIL,
    "token": TEST_TOKEN,
    "provider": User.PROVIDER_GOOGLE,
}

FACEBOOK_USER_DATA = {
    **GOOGLE_USER_DATA,
    "provider": User.PROVIDER_FACEBOOK,
}

SUCCESSFUL_FACEBOOK_RESPONSE = Mock(
    json=lambda: {"access_token": "test_access_token", "email": USER_EMAIL}, ok=True
)
FAILED_FACEBOOK_RESPONSE = Mock(json=lambda: {"error": "bad_token"}, ok=False)


class TestLogin:
    def test_login(self, authenticate_and_test):
        UserFactory(**USER_DATA)
        authenticate_and_test("authentication:login", USER_DATA)

    def test_login_wrong_password(self, authenticate_and_test):
        UserFactory(**USER_DATA)
        data = {
            **USER_DATA,
            "password": INVALID_PASSWORD,
        }
        authenticate_and_test("authentication:login", data, success=False)


class TestRegister:
    @pytest.mark.parametrize(
        "password",
        [
            "test_password",  # No number
            "837493938481",  # No letter
            "password1",  # Too common
            "uam38m",  # Too short
        ],
    )
    def test_register_with_bad_password(self, authenticate_and_test, password):
        data = {
            **USER_DATA,
            "password": password,
        }
        authenticate_and_test("authentication:register", data, success=False)

    def test_register_with_bad_email(self, authenticate_and_test):
        data = {
            **USER_DATA,
            "email": "abc@abc",
        }
        authenticate_and_test("authentication:register", data, success=False)

    def test_register_existing_email(self, authenticate_and_test):
        UserFactory(**USER_DATA)
        data = {**USER_DATA, "password": INVALID_PASSWORD}
        authenticate_and_test("authentication:register", data, success=False)

    def test_redirect(self, authenticate_and_test):
        redirect_url = "http://localhost:1234/test_path"
        data = {
            **USER_DATA,
            "next": redirect_url,
        }
        authenticate_and_test("authentication:register", data, redirect_url=redirect_url)

    def test_ignores_bad_redirect_param(self, authenticate_and_test):
        data = {
            **USER_DATA,
            "next": "https://badsite.com",
        }
        authenticate_and_test("authentication:register", data)


class TestLogout:
    def test_logout(self, post, client, authenticate_and_test):
        authenticate_and_test("authentication:register", USER_DATA)
        client.force_authenticate(User.objects.last())
        post(reverse("authentication:logout"))
        assert_unauthenticated(client)


class TestSocialAuth:
    @patch("google.oauth2.id_token.verify_oauth2_token")
    def test_google_login(self, verify_oauth2_token, authenticate_and_test):
        verify_oauth2_token.return_value = {
            "iss": VALID_GOOGLE_ISSUERS[0],
            "email": GOOGLE_USER_DATA["email"],
        }
        authenticate_and_test("authentication:social_auth", GOOGLE_USER_DATA)

    @patch("google.oauth2.id_token.verify_oauth2_token")
    def test_google_login_with_bad_token(self, verify_oauth2_token, authenticate_and_test):
        verify_oauth2_token.side_effect = ValueError()
        authenticate_and_test("authentication:social_auth", GOOGLE_USER_DATA, success=False)

    @patch("requests.get")
    def test_facebook_login(self, get, authenticate_and_test):
        data = {
            **FACEBOOK_USER_DATA,
            "provider": User.PROVIDER_FACEBOOK,
        }
        get.return_value = SUCCESSFUL_FACEBOOK_RESPONSE
        authenticate_and_test("authentication:social_auth", data)

    @patch("requests.get")
    def test_facebook_login_with_bad_token(self, get, authenticate_and_test):
        data = {
            **FACEBOOK_USER_DATA,
            "provider": User.PROVIDER_FACEBOOK,
        }
        # The first response is to get our facebook access token, the second is
        # to verify the submitted access_token.
        get.side_effect = [SUCCESSFUL_FACEBOOK_RESPONSE, FAILED_FACEBOOK_RESPONSE]
        authenticate_and_test("authentication:social_auth", data, success=False)
