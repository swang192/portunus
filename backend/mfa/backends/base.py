import secrets
import string

from django.conf import settings
from django.utils import timezone


class BaseMfaBackend:
    DEFAULT_TIMEOUT_SECONDS = 5 * 60

    def __init__(self, mfa_method):
        self.user = mfa_method.user
        self.mfa_method = mfa_method
        self.timeout = getattr(settings, "MFA_CODE_TIMEOUT", self.DEFAULT_TIMEOUT_SECONDS)

    def send_code(self):
        raise NotImplementedError()

    def generate_code(self):
        code = "".join([secrets.choice(string.digits) for _ in range(6)])
        self.mfa_method.current_code = code
        self.mfa_method.code_generated_at = timezone.now()
        self.mfa_method.save(update_fields=["current_code", "code_generated_at"])
        return code

    def verify_code(self, code):
        if self.mfa_method.current_code is None:
            return False

        time_delta = timezone.now() - self.mfa_method.code_generated_at
        if time_delta.total_seconds() > self.timeout:
            return False

        is_valid = code == self.mfa_method.current_code
        if is_valid:
            self.mfa_method.code = None
            self.mfa_method.save(update_fields=["current_code"])

        return is_valid
