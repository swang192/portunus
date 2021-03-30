from authentication.models import User


def force_password_reset(email):
    from shared.email import PortunusMailer

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return

    user.set_unusable_password()
    user.save()

    PortunusMailer.send_lockout_email(user)
