from datetime import timedelta

from rest_framework_simplejwt.tokens import Token, BlacklistMixin


RESET_PASSWORD_TOKEN_LIFETIME_MINUTES = 30


class ResetToken(BlacklistMixin, Token):
    token_type = "reset"
    lifetime = timedelta(minutes=RESET_PASSWORD_TOKEN_LIFETIME_MINUTES)
