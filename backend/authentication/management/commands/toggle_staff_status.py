from django.core.management.base import BaseCommand
from authentication.models import User


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("email")

    def handle(self, *args, **kwargs):
        try:
            user = User.objects.get(email=kwargs["email"])
        except User.DoesNotExist:
            print("User not found!")
            return

        user.is_staff = not user.is_staff
        user.save()

        print(f"Set is_staff to {user.is_staff}")
