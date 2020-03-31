from datetime import timedelta

from rest_framework_simplejwt.tokens import Token, BlacklistMixin


RESET_LINK_VALID_MINUTES = 5


class ResetToken(BlacklistMixin, Token):
    token_type = "reset"
    lifetime = timedelta(minutes=RESET_LINK_VALID_MINUTES)
