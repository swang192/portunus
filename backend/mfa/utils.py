from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.crypto import salted_hmac, constant_time_compare
from django.utils.http import int_to_base36, base36_to_int


User = get_user_model()


class MfaTokenGenerator(PasswordResetTokenGenerator):
    """
    Custom token generator:
        - separate expiration setting
        - longer hash (not truncated)
        - does not require user to check token
    """

    DEFAULT_TIMEOUT_SECONDS = 15 * 60

    def __init__(self):
        self.timeout = (
            getattr(settings, "MFA_TOKEN_TIMEOUT", None) or self.DEFAULT_TIMEOUT_SECONDS
        )
        super().__init__()

    def check_token(self, token):
        """
        Check that a password reset token is correct. Returns the associated
        user if it is, and None if it is not.
        """
        if not token:
            return None
        # Parse the token
        try:
            ts_b36, user_pk, _ = token.split("-")
        except ValueError:
            return None

        try:
            ts = base36_to_int(ts_b36)
            user = User.objects.get(pk=user_pk)
        except (ValueError, User.DoesNotExist):
            return None

        # Check that the timestamp/uid has not been tampered with
        if not constant_time_compare(self._make_token_with_timestamp(user, ts), token):
            return None

        # Check the timestamp is within limit.
        if (self._num_seconds(self._now()) - ts) > self.timeout:
            return None

        return user

    def _make_token_with_timestamp(self, user, timestamp):
        # timestamp is number of seconds since 2001-1-1. Converted to base 36,
        # this gives us a 6 digit string until about 2069.
        ts_b36 = int_to_base36(timestamp)
        hash_string = salted_hmac(
            self.key_salt,
            self._make_hash_value(user, timestamp),
            secret=self.secret,
            algorithm=self.algorithm,
        ).hexdigest()
        return f"{ts_b36}-{user.pk}-{hash_string}"


mfa_token_generator = MfaTokenGenerator()
