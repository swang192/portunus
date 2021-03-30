import pytest

from authentication.factories import UserFactory
from mfa.utils import mfa_token_generator


def test_mfa_token_none():
    assert mfa_token_generator.check_token(None) is None


def test_mfa_token_bad_token():
    assert mfa_token_generator.check_token("test") is None


@pytest.mark.django_db
def test_mfa_token_generator():
    user = UserFactory()
    token = mfa_token_generator.make_token(user)
    assert mfa_token_generator.check_token(token) == user
