from django.core.management.base import BaseCommand
from authentication.models import User


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("email")

    def handle(self, *args, **kwargs):
        try:
            user = User.objects.get(email=kwargs["email"])
        except User.DoesNotExist:
            print("User not found")
            return

        new_status = not user.is_superuser
        user.is_staff = new_status
        user.is_superuser = new_status
        user.save()

        print(f"Set superuser and is_staff status to {new_status}")
