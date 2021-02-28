import re

from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from zxcvbn import zxcvbn


has_alphabetic = re.compile(r"[a-zA-Z]")
has_numeric = re.compile(r"[\d]")
MIN_SCORE = 3


class AlphaNumericPasswordValidator:
    def validate(self, password, user=None):
        if not has_alphabetic.search(password):
            raise ValidationError(
                _("This password must contain at least one alphabetic character!")
            )
        if not has_numeric.search(password):
            raise ValidationError(
                _("This password must contain at least one numeric character!")
            )

    def get_help_text(self):
        return _(
            "Your password must contain at least 1 numeric character and 1 alphabetic "
            "character"
        )


class PasswordStrengthValidator:
    help_string = """Your password needs to be strong.
                  Try making it longer or adding in numeric and special characters to make it stronger."""

    def validate(self, password, user=None):
        score_data = zxcvbn(password)
        score = score_data.get("score")
        if score < MIN_SCORE:
            raise ValidationError(self.help_string)

    def get_help_text(self):
        return _(self.help_string)
