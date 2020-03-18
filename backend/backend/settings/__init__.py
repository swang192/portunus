from .zygoat_settings import *  # noqa

AUTH_USER_MODEL = "authentication.User"

INSTALLED_APPS = [
    *INSTALLED_APPS,
    "authentication",
]
