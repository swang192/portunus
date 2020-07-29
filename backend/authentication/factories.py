import factory

from authentication.models import User


class UserFactory(factory.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Faker("email")
    password = factory.PostGenerationMethodCall("set_password", factory.Faker("name"))
    portunus_uuid = factory.Faker("uuid4")
    social_login_provider = ""


class StaffUserFactory(UserFactory):
    is_staff = True
