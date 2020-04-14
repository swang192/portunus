import uuid

from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import UserManager


class User(AbstractUser):
    PROVIDER_FACEBOOK = "facebook"
    PROVIDER_GOOGLE = "google"

    PROVIDER_CHOICES = (
        (PROVIDER_FACEBOOK, "Facebook"),
        (PROVIDER_GOOGLE, "Google"),
    )

    username = None
    portunus_uuid = models.UUIDField(default=uuid.uuid4)
    email = models.EmailField(_("email address"), unique=True)
    social_login_provider = models.CharField(
        max_length=256, choices=PROVIDER_CHOICES, blank=True, default=""
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()
