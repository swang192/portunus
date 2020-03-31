from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView

from . import views

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path("token/refresh/", views.TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("change-password/", views.change_password, name="change_password"),
    path("password-reset/", views.request_password_reset, name="password_reset"),
    path("password-reset/complete/", views.reset_password, name="password_reset_complete"),
]
