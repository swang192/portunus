from importlib import import_module

from functools import partial
from django.db import transaction


def get_partial(task, *args, **kwargs):
    imported_task = task

    if isinstance(task, str):
        module, attr = task.split(":")

        # Have the option to import here to avoid circular dependencies that the tasks are fraught with
        imported_task = getattr(import_module(module), attr)

    imported_task = getattr(imported_task, "delay")

    return partial(imported_task, *args, **kwargs)


def enqueue(task, *args, **kwargs):
    partial_task = get_partial(task, *args, **kwargs)

    # Since the calling code could have modified the same records that
    #   the worker needs, make sure the database has committed the
    #   new data before proceeding so that the worker has access to
    #   the data.
    transaction.on_commit(partial_task)
