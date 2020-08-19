import logging
import json
from functools import wraps
from time import gmtime, strftime

logger = logging.getLogger(__name__)


def _default_get_user_identifier(request):
    if request.user.is_authenticated:
        return request.user.email
    return None


def log_event(event_type, request, extra_data=None, level=logging.INFO):
    """
    Logs an event with default information and, optionally, additional data included

    :param event_type: Event identifier to show in the logs.
    :param request: Django request associated with the event.
    :param extra_data: Extra data to include in the logged event.
    :param level: Log level to use.
    """
    event_dict = {
        "event_type": event_type,
        "timestamp": strftime("%Y-%m-%d %H:%M:%S", gmtime()),
        "ip_address": request.META["REMOTE_ADDR"],
    }
    user_identifier = _default_get_user_identifier(request)
    if user_identifier:
        event_dict["user"] = user_identifier

    if extra_data:
        event_dict.update(extra_data)

    logger.log(level, f"ZYGOAT: {json.dumps(event_dict)}")


def log_view_outcome(event_type=None):
    """
    Creates a decorator that logs basic info about the result of the view

    :param event_type: Event identifier to show in the logs.
    :return: A decorator that logs the outcome of a view.
    """

    def decorator(view):
        @wraps(view)
        def inner(request, *args, **kwargs):
            response = view(request, *args, **kwargs)

            extra_data = {
                "status_code": response.status_code,
            }
            log_event(event_type or view.__name__, request, extra_data=extra_data)

            return response

        return inner

    return decorator
