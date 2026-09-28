"""Shared fixtures for the tenancy integration tests.

These tests run against a REAL Postgres database (DATABASE_URL). They create their
own uniquely named organisations and delete everything they created afterwards.
They refuse to run against any host that looks like staging or production.
"""
import uuid
from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete
from sqlalchemy.engine import make_url

from app.core.config import settings

_host = (make_url(settings.database_url).host or "").lower()
if any(word in _host for word in ("prod", "staging")):
    raise RuntimeError(
        f"Refusing to run tests against {_host!r}. "
        "Point DATABASE_URL at a dev or throwaway database."
    )

from app.core.db import SessionLocal  # noqa: E402
from app.core.security import decode_token  # noqa: E402
from app.main import app  # noqa: E402
from app.models.employee import Employee  # noqa: E402
from app.models.event import Event  # noqa: E402
from app.models.leave_balance import LeaveBalance  # noqa: E402
from app.models.org import Org  # noqa: E402
from app.models.org_unit import OrgUnit  # noqa: E402
from app.models.user import User  # noqa: E402

API = "/api/v1"
PASSWORD = "Tenancy-test-Pass-1"


def _make_org(client, label, run_id, created_org_ids):
    """Register a new org (its admin comes with it), one unit and three employees."""
    register = client.post(
        f"{API}/auth/register",
        json={
            "org_name": f"Tenancy Test {label} {run_id}",
            "email": f"admin-{label.lower()}-{run_id}@tenancytest.et",
            "password": PASSWORD,
        },
    )
    assert register.status_code == 200, register.text
    token = register.json()["access_token"]
    org_id = decode_token(token)["org_id"]
    created_org_ids.append(org_id)
    headers = {"Authorization": f"Bearer {token}"}

    unit = client.post(
        f"{API}/org-units",
        json={"name": f"HQ {label}", "unit_type": "company"},
        headers=headers,
    )
    assert unit.status_code == 200, unit.text
    unit_id = unit.json()["id"]

    employee_ids = []
    for n in range(3):
        created = client.post(
            f"{API}/employees",
            json={
                "org_unit_id": unit_id,
                "manager_id": employee_ids[0] if employee_ids else None,
                "first_name": f"{label}First{n}",
                "last_name": f"{label}Last{n}",
                "email": f"emp{n}-{label.lower()}-{run_id}@tenancytest.et",
                "hire_date": "2024-01-15",
                "base_salary_etb": 20000,
                "is_ethiopian_national": True,
            },
            headers=headers,
        )
        assert created.status_code == 200, created.text
        employee_ids.append(created.json()["id"])

    return SimpleNamespace(
        org_id=org_id, headers=headers, unit_id=unit_id, employee_ids=employee_ids
    )


def _purge(org_ids):
    """Delete every row the tests created, children before parents."""
    with SessionLocal() as db:
        for org_id in org_ids:
            oid = uuid.UUID(org_id)
            for model in (LeaveBalance, Event, Employee, OrgUnit, User):
                db.execute(delete(model).where(model.org_id == oid))
            db.execute(delete(Org).where(Org.id == oid))
        db.commit()


@pytest.fixture(scope="module")
def tenants():
    """Two separate orgs, each with an admin, one org unit and three employees."""
    run_id = uuid.uuid4().hex[:8]
    client = TestClient(app)
    created = []
    try:
        org_a = _make_org(client, "A", run_id, created)
        org_b = _make_org(client, "B", run_id, created)
        yield SimpleNamespace(client=client, a=org_a, b=org_b)
    finally:
        _purge(created)


@pytest.fixture(params=["a_to_b", "b_to_a"])
def pair(request, tenants):
    """(client, me, other): every test runs once as A attacking B and once as B attacking A."""
    if request.param == "a_to_b":
        return tenants.client, tenants.a, tenants.b
    return tenants.client, tenants.b, tenants.a
