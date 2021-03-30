from mfa.backends.base import BaseMfaBackend
from shared.email import PortunusMailer


class PortunusEmailBackend(BaseMfaBackend):
    def send_code(self):
        context = {
            "code": self.generate_code(),
            "user": self.user,
        }
        PortunusMailer.send_email(
            [self.user.email],
            "Your MetLife Legal Plans Security Code",
            "mfa/email_code",
            context,
            from_email="MetLife Legal Plans <noreply@legalplans.com>",
        )
