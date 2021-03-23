from django.conf import settings
from django.db import models
from django.utils import timezone

from mfa.backends.email import PortunusEmailBackend


class MfaMethod(models.Model):
    MFA_TYPE_EMAIL = "email"
    MFA_TYPE_CHOICES = ((MFA_TYPE_EMAIL, "Email"),)

    MFA_BACKENDS = {
        MFA_TYPE_EMAIL: PortunusEmailBackend,
    }

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="mfa_methods",
    )
    type = models.CharField(
        max_length=255,
        choices=MFA_TYPE_CHOICES,
    )
    is_active = models.BooleanField(default=False)
    is_primary = models.BooleanField(default=False)
    current_code = models.CharField(max_length=16, null=True, blank=True)
    code_generated_at = models.DateTimeField(default=timezone.now)

    @property
    def backend(self):
        return MfaMethod.MFA_BACKENDS[self.type](
            mfa_method=self,
        )

    def verify_code(self, code):
        return self.backend.verify_code(code)

    def send_code(self):
        return self.backend.send_code()
