from django.middleware.csrf import get_token
from django.http import HttpResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    content = {"email": request.user.email}
    return Response(content)


@csrf_exempt
@require_POST
def set_csrf(request):
    # This will set the csrf cookie data as a side effect.
    get_token(request)
    return HttpResponse("success", status=HTTP_200_OK)
