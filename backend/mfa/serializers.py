from rest_framework import serializers

from .models import MfaMethod
from .utils import mfa_token_generator
from .errors import default_error_messages


class MfaMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = MfaMethod
        fields = ("type", "is_active", "is_primary")


class CodeLoginSerializer(serializers.Serializer):
    mfa_token = serializers.CharField()
    code = serializers.CharField()

    default_error_messages = default_error_messages

    def validate(self, data):
        mfa_token = data.get("mfa_token")
        code = data.get("code")

        self.user = mfa_token_generator.check_token(mfa_token)
        if not self.user:
            self.fail("invalid_token")

        for mfa_method in self.user.mfa_methods.filter(is_active=True):
            if mfa_method.verify_code(code):
                return data

        self.fail("invalid_code")


class RequestMfaActivationSerializer(serializers.Serializer):
    mfa_method = serializers.ChoiceField(choices=MfaMethod.MFA_TYPE_CHOICES)

    default_error_messages = default_error_messages

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = self.context["request"].user

    def validate_mfa_method(self, value):
        self.mfa_method = MfaMethod.objects.filter(user=self.user, type=value).first()
        # We cannot activate a method that is already active. If the method
        # does not exist then it is considered inactive.
        if self.mfa_method and self.mfa_method.is_active:
            self.fail("mfa_method_already_active")

        return value

    def create(self, validated_data):
        if self.mfa_method is None:
            self.mfa_method = MfaMethod.objects.create(
                user=self.user,
                type=validated_data["mfa_method"],
                is_active=False,
            )
        self.mfa_method.send_code()
        return self.mfa_method


class MfaActivationConfirmationSerializer(serializers.Serializer):
    mfa_method = serializers.ChoiceField(choices=MfaMethod.MFA_TYPE_CHOICES)
    code = serializers.CharField()

    default_error_messages = default_error_messages

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = self.context["request"].user

    def validate_mfa_method(self, value):
        self.mfa_method = MfaMethod.objects.filter(user=self.user, type=value).first()
        if self.mfa_method is None:
            self.fail("mfa_method_does_not_exist")
        if self.mfa_method.is_active:
            self.fail("mfa_method_already_active")
        return value

    def validate(self, data):
        if not self.mfa_method.verify_code(data.get("code")):
            self.fail("invalid_code")

        return super().validate(data)

    def create(self, validated_data):
        has_primary_mfa = MfaMethod.objects.filter(
            user=self.user,
            is_primary=True,
        ).exists()

        self.mfa_method.is_active = True
        self.mfa_method.is_primary = not has_primary_mfa
        self.mfa_method.save(update_fields=["is_active", "is_primary"])
        return self.mfa_method


class SendMfaCodeSerializer(serializers.Serializer):
    mfa_method = serializers.CharField()

    default_error_messages = default_error_messages

    def validate_mfa_method(self, value):
        self.mfa_method = MfaMethod.objects.filter(
            user=self.context["request"].user, type=value
        ).first()
        if self.mfa_method is None:
            self.fail("mfa_method_does_not_exist")
        return value

    def save(self):
        self.mfa_method.send_code()


class SendMfaCodeUsingTokenSerializer(serializers.Serializer):
    mfa_method = serializers.CharField()
    mfa_token = serializers.CharField()

    def validate(self, data):
        user = mfa_token_generator.check_token(data.get("mfa_token"))
        if not user:
            self.fail("invalid_token")

        self.mfa_method = MfaMethod.objects.filter(
            user=user, type=data.get("mfa_method")
        ).first()
        if self.mfa_method is None:
            self.fail("mfa_method_does_not_exist")

        return data

    def save(self):
        self.mfa_method.send_code()


class MfaDeactivationConfirmationSerializer(serializers.Serializer):
    mfa_method = serializers.CharField()

    default_error_messages = default_error_messages

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = self.context["request"].user

    def validate_mfa_method(self, value):
        self.mfa_method = MfaMethod.objects.filter(user=self.user, type=value).first()
        if self.mfa_method is None:
            self.fail("mfa_method_does_not_exist")
        if not self.mfa_method.is_active:
            self.fail("mfa_method_already_inactive")
        return value

    def save(self):
        self.mfa_method.is_active = False
        self.mfa_method.is_primary = False
        self.mfa_method.save(update_fields=["is_active", "is_primary"])
        return self.mfa_method
