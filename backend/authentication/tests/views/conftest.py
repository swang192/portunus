import json

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from .utils import (
    assert_successful_response,
    assert_authenticated,
    assert_failure_response,
    assert_unauthenticated,
)


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def post(client):
    def inner(url, data=None):
        return client.post(url, data and json.dumps(data), content_type="application/json")

    return inner


@pytest.fixture
def authenticate_and_test(client, post):
    def test(view_name, data, success=True, redirect_url=None):
        response = post(reverse(view_name), data)
        if success:
            assert_successful_response(response, redirect_url)
            assert_authenticated(client)
        else:
            assert_failure_response(response)
            assert_unauthenticated(client)

    return test
