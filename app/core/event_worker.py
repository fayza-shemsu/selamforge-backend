import time

from sqlalchemy import select

from app.core.db import SessionLocal
from app.core.handlers import registry
from app.models.event import Event

# Import handler modules here so their @on_event decorators run and
# populate the registry before the worker loop starts. Empty for now -
# Day 9 will add the first one (app.handlers.employee_handlers).


def process_batch(session, batch_size: int = 10) -> int:
    """
    Process one batch of pending events. Returns how many rows were
    looked at (handled, left pending, or marked failed).
    """
    rows = session.execute(
        select(Event)
        .where(Event.status == "pending")
        .with_for_update(skip_locked=True)
        .limit(batch_size)
    ).scalars().all()

    for ev in rows:
        handler = registry.get(ev.event_type)

        if handler is None:
            # No handler registered for this event_type yet.
            # Leave it exactly as "pending" - do not touch it.
            continue

        try:
            handler(session, ev.payload)
            ev.status = "done"
        except Exception:
            ev.attempts += 1
            if ev.attempts >= ev.max_attempts:
                ev.status = "failed"
            # else: stays "pending", will be retried on a future poll

        session.commit()

    return len(rows)


def run_worker_loop(poll_interval_seconds: int = 5):
    print("event_worker: starting poll loop")
    while True:
        with SessionLocal() as session:
            count = process_batch(session)
            if count:
                print(f"event_worker: processed batch of {count}")
        time.sleep(poll_interval_seconds)


if __name__ == "__main__":
    run_worker_loop()
