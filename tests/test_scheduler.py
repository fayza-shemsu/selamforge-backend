from app.services.scheduler import scheduler, start_scheduler


def test_start_scheduler_registers_event_and_leave_jobs():
    start_scheduler()
    try:
        assert scheduler.get_job("event_outbox_worker") is not None
        assert scheduler.get_job("nightly_leave_accrual") is not None
    finally:
        scheduler.shutdown(wait=False)