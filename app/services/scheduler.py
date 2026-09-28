import logging

from apscheduler.schedulers.background import BackgroundScheduler

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()


def run_leave_accrual():
    """Nightly job: accrue leave for all employees.

    Stub for Day 17 — actual proportional accrual logic
    (entitlement / 365 per run) is implemented on Day 18.
    """
    logger.info("run_leave_accrual: stub called, no-op until Day 18")


def start_scheduler():
    if not scheduler.running:
        scheduler.add_job(
            run_leave_accrual,
            trigger="cron",
            hour=0,
            minute=0,
            id="nightly_leave_accrual",
            replace_existing=True,
        )
        scheduler.start()
        logger.info("Scheduler started: nightly_leave_accrual registered")
