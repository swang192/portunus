from datetime import timedelta

from rest_framework_simplejwt.tokens import Token

CHANGE_EMAIL_TOKEN_LIFETIME_MINUTES = 30


# Not inheriting the BlacklistMixin class so the token will not be included in the outstanding token
# list so that it doesn't get cleared on logout.  If the user logs out before clicking the verification
# link, we still want the link (and token) to be valid.
class ChangeEmailToken(Token):
    token_type = "change_email"
    lifetime = timedelta(minutes=CHANGE_EMAIL_TOKEN_LIFETIME_MINUTES)
