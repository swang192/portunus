from .zygoat_settings import *  # noqa

AUTH_USER_MODEL = "authentication.User"

INSTALLED_APPS = [
    *INSTALLED_APPS,
    "rest_framework",
    "authentication",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    *MIDDLEWARE,
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "simplejwt_extensions.authentication.JWTAuthentication",
    ),
}

DEFAULT_SIGNING_KEY = """-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQC91RWCawEvxQj+tigRvuHxouO8jKd35ukUxFBFRAGcI57firbA
kFII6zPIiWAENGMqtjX57hk9EjAZ27XvQ4SQACvD5j7htsJT31bZbVUH7a3JEDpx
a02VXpXdfPYSs8umZkdxMxxmiD9uH9VmLN3VS14lxQlyJdlvbLmNCAf6uwIDAQAB
AoGACXFcDIy+Fl46wFDXVWqlWpu7sFleyzwVRA8v3wIvAlFTSdNgm9uR+ReaD9Ol
jw/8DtfZf4E0iDEra13egvRc16byYQ4qv0l7xvn3ATomxcPwbdvkfYE4C0EZFuXx
ZZwSQwWsNl/36BSyZErw8y/THMIkOKRNFuJarK4P3aYppEECQQDpvRnL2kbbXbqW
uB8Pt2hMfBXW/byCcctoI+cuqYAUJ/J1tLPe+q7sAW6Fr0WpYTpjljC+UCqu/a6a
YgG0L6I5AkEAz+l7QfyFKk7jl05hEUly0CNshgJ8jLPcF2ZXILrcUwGxbpdyjmCJ
ExiKpfzPufYeu7qLwhyaHniR9huSZIx0kwJBALMRTFIAR4iHpgsRw7omqKDv70tl
2KWWyF5gIxx8fsLyV64VYjfRlXD5J9MDFDtPYYwp4+3pPMoTT1C3BNcmJwECQEYV
Ero0b4LKYsce4XNdSblFJ5Coh+k5u2eb1KSwuBG20WNQ44mAmtP4AsxewnqRrtxi
zjdZQs4goDrQInGIMscCQQCIT5jvRb197iRinBqpNy01i7GdlLtMC7Z9V/PV0YW1
GmX50gvd7aA+i2UuZj7BxapFStyEGl4Nggglnn+QqQ+L
-----END RSA PRIVATE KEY-----"""

DEFAULT_VERIFYING_KEY = """-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC91RWCawEvxQj+tigRvuHxouO8
jKd35ukUxFBFRAGcI57firbAkFII6zPIiWAENGMqtjX57hk9EjAZ27XvQ4SQACvD
5j7htsJT31bZbVUH7a3JEDpxa02VXpXdfPYSs8umZkdxMxxmiD9uH9VmLN3VS14l
xQlyJdlvbLmNCAf6uwIDAQAB
-----END PUBLIC KEY-----"""

# In production, we throw an exception if these are not included in the
# environment variables.
if PRODUCTION:
    DEFAULT_SIGNING_KEY = environ.Env.NOTSET
    DEFAULT_VERIFYING_KEY = environ.Env.NOTSET

SIMPLE_JWT = {
    "USER_ID_FIELD": "portunus_uuid",
    "NEW_USER_CALLBACK": "backend.utils.create_user",
    "ALGORITHM": "RS512",
    "SIGNING_KEY": env.str("DJANGO_JWT_SIGNING_KEY", DEFAULT_SIGNING_KEY),
    "VERIFYING_KEY": env.str("DJANGO_JWT_VEFIFYING_KEY", DEFAULT_VERIFYING_KEY),
}

CORS_ORIGIN_ALLOW_ALL = DEBUG
CORS_ALLOW_CREDENTIALS = True
