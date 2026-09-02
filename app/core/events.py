from sqlalchemy.orm import Session

from app.models.event import Event


def emit_event(
    session: Session,
    org_id: str,
    event_type: str,
    source_module: str,
    payload: dict,
) -> Event:
    """
    Add an event row to the session. Does NOT commit.
    The caller is responsible for committing this as part of the same
    transaction as whatever business action triggered the event, so the
    event and the action it describes are always atomic together.
    """
    event = Event(
        org_id=org_id,
        event_type=event_type,
        source_module=source_module,
        payload=payload,
        status="pending",
    )
    session.add(event)
    return event
