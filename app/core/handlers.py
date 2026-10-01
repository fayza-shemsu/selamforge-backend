from typing import Callable, Dict

# Maps event_type -> handler function.
# A handler takes (session, payload) and does whatever work that event
# type requires. If an event_type has no entry here, the worker leaves
# it untouched (still "pending") rather than guessing or dropping it.
registry: Dict[str, Callable] = {}


def on_event(event_type: str):
    def decorator(func: Callable) -> Callable:
        registry[event_type] = func
        return func
    return decorator
