import factory

from mfa.models import MfaMethod


class MfaMethodFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MfaMethod

    type = MfaMethod.MFA_TYPE_EMAIL
