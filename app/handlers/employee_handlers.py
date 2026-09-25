from app.core.handlers import on_event
from app.models.leave_balance import LeaveBalance


@on_event("employee.created")
def handle_employee_created(session, payload: dict):
    employee_id = payload["employee_id"]

    leave_balance = LeaveBalance(
        org_id=_get_employee_org_id(session, employee_id),
        employee_id=employee_id,
        accrued_days=0,
        used_days=0,
    )
    session.add(leave_balance)


def _get_employee_org_id(session, employee_id: str) -> str:
    from app.models.employee import Employee
    employee = session.query(Employee).filter(Employee.id == employee_id).first()
    return employee.org_id
