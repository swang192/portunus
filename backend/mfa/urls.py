from django.urls import path

from . import views

urlpatterns = [
    path(
        "<str:mfa_method>/activate/",
        views.RequestMfaMethodActivationView.as_view(),
        name="request_activation",
    ),
    path(
        "<str:mfa_method>/activate/confirm/",
        views.ConfirmMfaMethodActivationView.as_view(),
        name="confirm_activation",
    ),
    path(
        "<str:mfa_method>/deactivate/confirm/",
        views.ConfirmMfaMethodDeactivationView.as_view(),
        name="confirm_deactivation",
    ),
    path("<str:mfa_method>/send-code/", views.SendMfaCodeView.as_view(), name="send_mfa_code"),
    path(
        "<str:mfa_method>/send-code-using-token/",
        views.SendMfaCodeUsingTokenView.as_view(),
        name="send_mfa_code_using_token",
    ),
    path("methods/", views.MfaMethodsListView.as_view(), name="list_methods"),
]
