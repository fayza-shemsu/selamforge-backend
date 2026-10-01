import logging
from datetime import date

from apscheduler.schedulers.background import BackgroundScheduler

from app.core.db import SessionLocal
from app.models.employee import Employee
import app.models  # noqa: F401 -- registers all models so FK targets resolve
from app.models.leave_balance import LeaveBalance
from app.services.leave import calculate_annual_leave_entitlement
from app.core.event_worker import process_batch

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()


def process_event_batch():
    with SessionLocal() as session:
        try:
            return process_batch(session)
        except Exception:
            session.rollback()
            logger.exception("event outbox batch failed")
            return 0


def run_leave_accrual():
    """Nightly job: accrue leave proportionally for every active employee.

    Adds entitlement / 365 to accrued_days each run, capped at the
    employee's full annual entitlement so a balance never grows past
    what they're owed for the year.
    """
    with SessionLocal() as session:
        employees = session.query(Employee).filter(Employee.status == "active").all()

        updated = 0
        for employee in employees:
            balance = (
                session.query(LeaveBalance)
                .filter(LeaveBalance.employee_id == employee.id)
                .first()
            )
            if balance is None:
                logger.warning("No leave_balances row for employee %s, skipping", employee.id)
                continue

            years_of_service = (date.today() - employee.hire_date).days // 365
            entitlement = calculate_annual_leave_entitlement(years_of_service)
            daily_accrual = entitlement / 365

            new_accrued = float(balance.accrued_days) + daily_accrual
            balance.accrued_days = min(new_accrued, entitlement)
            updated += 1

        session.commit()
        logger.info("run_leave_accrual: updated %s employees", updated)
        return updated


def start_scheduler():
    if not scheduler.running:
        scheduler.add_job(
            process_event_batch,
            trigger="interval",
            seconds=5,
            id="event_outbox_worker",
            replace_existing=True,
            max_instances=1,
        )
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
