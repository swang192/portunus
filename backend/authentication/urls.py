from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView

from . import views

app_name = "authentication"

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.login, name="login"),
    path("social-auth/", views.social_auth, name="social_auth"),
    path("logout/", views.logout, name="logout"),
    path("token/refresh/", views.TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("change-password/", views.change_password, name="change_password"),
    path("password-reset/", views.request_password_reset, name="password_reset"),
    path("password-reset/complete/", views.reset_password, name="password_reset_complete"),
    path("change-email/", views.change_email, name="change_email"),
]
