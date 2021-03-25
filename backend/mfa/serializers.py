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

    def __init__(self, *args, **kwargs):
        super().__init__(self, *args, **kwargs)
        self.user = None

    def validate(self, data):
        mfa_token = data.get("mfa_token")
        code = data.get("code")

        self.user = mfa_token_generator.check_token(mfa_token)
        if not self.user:
            self.fail("invalid_token")

        primary_mfa_method = self.user.mfa_methods.filter(is_primary=True).first()
        if primary_mfa_method.verify_code(code):
            return data

        self.fail("invalid_code")


class MfaSerializer(serializers.Serializer):
    mfa_method = serializers.ChoiceField(choices=MfaMethod.MFA_TYPE_CHOICES)

    default_error_messages = default_error_messages

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = self.get_user()
        self.mfa_method = self.get_mfa_method()

    def get_user(self):
        return self.context["request"].user

    def get_mfa_method(self):
        mfa_type = self.initial_data.get("mfa_method")
        if mfa_type:
            return MfaMethod.objects.filter(user=self.user, type=mfa_type).first()
        return None

    def validate_mfa_method(self, value):
        if self.mfa_method is None:
            self.fail("mfa_method_does_not_exist")
        return value


class RequestMfaActivationSerializer(MfaSerializer):
    def validate_mfa_method(self, value):
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


class MfaActivationConfirmationSerializer(MfaSerializer):
    code = serializers.CharField()

    def validate_mfa_method(self, value):
        super().validate_mfa_method(value)
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


class SendMfaCodeSerializer(MfaSerializer):
    def save(self):
        self.mfa_method.send_code()


class SendMfaCodeUsingTokenSerializer(MfaSerializer):
    mfa_token = serializers.CharField()

    def get_user(self):
        return mfa_token_generator.check_token(self.initial_data.get("mfa_token"))

    def validate_token(self):
        if not self.user:
            self.fail("invalid_token")

    def save(self):
        self.mfa_method.send_code()


class MfaDeactivationConfirmationSerializer(MfaSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = self.context["request"].user

    def validate_mfa_method(self, value):
        super().validate_mfa_method(value)
        if not self.mfa_method.is_active:
            self.fail("mfa_method_already_inactive")
        return value

    def save(self):
        self.mfa_method.is_active = False
        self.mfa_method.is_primary = False
        self.mfa_method.save(update_fields=["is_active", "is_primary"])
        return self.mfa_method
