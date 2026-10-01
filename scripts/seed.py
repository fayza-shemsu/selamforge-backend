"""
Seed script: 3 demo organisations, each with an org-unit tree and 17 employees
connected by manager chains (51 employees total).

Run from the repo root:

    APP_ENV=local   SEED_PASSWORD='...' python -m scripts.seed
    APP_ENV=staging SEED_PASSWORD='...' DATABASE_URL='...' python -m scripts.seed

Safety:
  * Refuses to run unless APP_ENV is 'local' or 'staging'.
  * Refuses any database host whose name contains 'prod'.
  * Requires SEED_PASSWORD (never hard-coded in the repo).
  * Re-runnable: an organisation that already exists (matched by name) is skipped.

Each org gets three demo logins that share SEED_PASSWORD:
    admin   -> the CEO
    manager -> the first department head
    employee-> a staff member
"""
import os
import sys
import uuid
from datetime import date, timedelta

ALLOWED_ENVS = {"local", "staging"}
BLOCKED_HOST_WORDS = ("prod",)

# --------------------------------------------------------------------------
# Hand-curated data. Ethiopian naming: given name + father's given name.
# Each org has exactly 17 people in this fixed shape:
#   0        CEO
#   1-3      department heads (report to CEO)
#   4-9      team leads (two per department, report to their head)
#   10-16    staff (each reports to a team lead)
# --------------------------------------------------------------------------
ORGS = [
    {
        "name": "Lalibela Coffee Exporters",
        "domain": "lalibelacoffee.et",
        "depts": ["Sourcing & Farmer Relations", "Export Operations", "Finance & Admin"],
        "teams": [
            "Yirgacheffe Sourcing", "Sidama Sourcing",
            "Quality Control", "Shipping & Customs",
            "Accounting", "HR & Admin",
        ],
        "people": [
            ("Tigist", "Haile"), ("Dawit", "Tesfaye"), ("Meseret", "Alemu"),
            ("Yonas", "Bekele"), ("Hana", "Girma"), ("Samuel", "Worku"),
            ("Rahel", "Assefa"), ("Kidus", "Mulugeta"), ("Mekdes", "Abera"),
            ("Biruk", "Tadesse"), ("Bethlehem", "Negash"), ("Abel", "Getachew"),
            ("Eden", "Fikadu"), ("Henok", "Zewdu"), ("Liya", "Berhanu"),
            ("Nahom", "Yilma"), ("Saron", "Demissie"),
        ],
    },
    {
        "name": "Abay Logistics PLC",
        "domain": "abaylogistics.et",
        "depts": ["Fleet Operations", "Warehousing", "Commercial"],
        "teams": [
            "Long-haul Dispatch", "Fleet Maintenance",
            "Addis Hub", "Djibouti Corridor",
            "Sales", "Customer Support",
        ],
        "people": [
            ("Bereket", "Wolde"), ("Almaz", "Tekle"), ("Getnet", "Mengistu"),
            ("Frehiwot", "Shiferaw"), ("Yared", "Lemma"), ("Mulu", "Abate"),
            ("Tsegaye", "Hailu"), ("Aster", "Gebre"), ("Solomon", "Kassa"),
            ("Zewditu", "Tilahun"), ("Elias", "Mamo"), ("Marta", "Dinku"),
            ("Nathnael", "Bogale"), ("Birtukan", "Endale"), ("Amanuel", "Regassa"),
            ("Ruth", "Teshome"), ("Fasil", "Ayele"),
        ],
    },
    {
        "name": "Tana Digital Solutions",
        "domain": "tanadigital.et",
        "depts": ["Engineering", "Product & Design", "People & Finance"],
        "teams": [
            "Backend", "Mobile",
            "Design", "User Research",
            "Recruiting", "Finance",
        ],
        "people": [
            ("Meron", "Abebe"), ("Robel", "Gebremedhin"), ("Sara", "Wondimu"),
            ("Kaleb", "Mekonnen"), ("Blen", "Taddese"), ("Natnael", "Fekadu"),
            ("Yordanos", "Belay"), ("Ephrem", "Tsehay"), ("Hiwot", "Nigussie"),
            ("Tewodros", "Kifle"), ("Winta", "Berhe"), ("Mikias", "Shimelis"),
            ("Rediet", "Amare"), ("Surafel", "Eshetu"), ("Lidya", "Gizaw"),
            ("Abenezer", "Taye"), ("Mahlet", "Zerihun"),
        ],
    },
]

BASE_SALARY = {"ceo": 200000, "head": 110000, "lead": 65000, "staff": 28000}


def build_plan(org: dict) -> dict:
    """Turn one ORGS entry into unit and employee specs. Pure data, no database."""
    assert len(org["people"]) == 17, "each org must have exactly 17 people"
    assert len(org["depts"]) == 3 and len(org["teams"]) == 6

    units = [{"key": "root", "name": org["name"], "unit_type": "company", "parent": None}]
    for d, name in enumerate(org["depts"]):
        units.append({"key": f"d{d}", "name": name, "unit_type": "department", "parent": "root"})
    for t, name in enumerate(org["teams"]):
        units.append({"key": f"t{t}", "name": name, "unit_type": "team", "parent": f"d{t // 2}"})

    employees = []
    for i, (first, last) in enumerate(org["people"]):
        if i == 0:
            role, unit, manager = "ceo", "root", None
        elif i <= 3:
            role, unit, manager = "head", f"d{i - 1}", 0
        elif i <= 9:
            team = i - 4
            role, unit, manager = "lead", f"t{team}", 1 + team // 2
        else:
            lead = 4 + (i - 10) % 6
            role, unit, manager = "staff", f"t{lead - 4}", lead

        employees.append({
            "index": i,
            "first": first,
            "last": last,
            "email": f"{first.lower()}.{last.lower()}@{org['domain']}",
            "role": role,
            "unit": unit,
            "manager": manager,
            "salary": BASE_SALARY[role] + i * 1500,
            "hire_date": date(2018, 3, 1) + timedelta(days=i * 83),
        })

    # Demo logins: admin = CEO, manager = first head, employee = first staff member.
    logins = [(0, "admin"), (1, "manager"), (10, "employee")]
    return {"units": units, "employees": employees, "logins": logins}


def guard() -> tuple:
    """Refuse to run anywhere except an explicitly allowed environment."""
    env = os.environ.get("APP_ENV", "").strip().lower()
    if env not in ALLOWED_ENVS:
        sys.exit(
            f"REFUSING TO RUN: APP_ENV={env!r}. Set APP_ENV to one of "
            f"{sorted(ALLOWED_ENVS)} to seed."
        )

    password = os.environ.get("SEED_PASSWORD", "")
    if len(password) < 8:
        sys.exit("REFUSING TO RUN: set SEED_PASSWORD (at least 8 characters) for the demo logins.")

    from sqlalchemy.engine import make_url
    from app.core.config import settings

    host = (make_url(settings.database_url).host or "").lower()
    if any(word in host for word in BLOCKED_HOST_WORDS):
        sys.exit(f"REFUSING TO RUN: database host {host!r} looks like production.")

    return env, password, host


def seed_org(db, org: dict, password: str) -> bool:
    """Create one org with its units, employees, users and creation events."""
    from app.core.events import emit_event
    from app.core.security import hash_password
    from app.models.employee import Employee
    from app.models.org import Org
    from app.models.org_unit import OrgUnit
    from app.models.user import User

    if db.query(Org).filter(Org.name == org["name"]).first():
        print(f"  - {org['name']}: already exists, skipped")
        return False

    plan = build_plan(org)

    org_row = Org(name=org["name"])
    db.add(org_row)
    db.flush()

    # Org units: parents are listed before children, so insert order is safe.
    unit_ids = {}
    for spec in plan["units"]:
        unit_ids[spec["key"]] = uuid.uuid4()
        db.add(OrgUnit(
            id=unit_ids[spec["key"]],
            org_id=org_row.id,
            name=spec["name"],
            unit_type=spec["unit_type"],
            parent_unit_id=unit_ids[spec["parent"]] if spec["parent"] else None,
        ))
    db.flush()

    # Employees: managers always have a lower index than their reports.
    employee_ids = {}
    for spec in plan["employees"]:
        employee_ids[spec["index"]] = uuid.uuid4()
        db.add(Employee(
            id=employee_ids[spec["index"]],
            org_id=org_row.id,
            org_unit_id=unit_ids[spec["unit"]],
            manager_id=employee_ids[spec["manager"]] if spec["manager"] is not None else None,
            first_name=spec["first"],
            last_name=spec["last"],
            email=spec["email"],
            hire_date=spec["hire_date"],
            base_salary_etb=spec["salary"],
            is_ethiopian_national=True,
            status="active",
        ))
    db.flush()

    # Same event the API emits, so leave balances are created the normal way.
    for spec in plan["employees"]:
        emit_event(
            db,
            org_id=org_row.id,
            event_type="employee.created",
            source_module="employees",
            payload={"employee_id": str(employee_ids[spec["index"]])},
        )

    hashed = hash_password(password)
    made_logins = []
    for index, role in plan["logins"]:
        email = plan["employees"][index]["email"]
        if db.query(User).filter(User.email == email).first():
            continue
        db.add(User(org_id=org_row.id, email=email, hashed_password=hashed, role=role))
        made_logins.append((role, email))

    db.commit()

    print(f"  + {org['name']}: {len(plan['units'])} units, {len(plan['employees'])} employees")
    for role, email in made_logins:
        print(f"      login ({role}): {email}")
    return True


def main() -> None:
    env, password, host = guard()
    print(f"Seeding [{env}] database on host: {host}")

    from app.core.db import SessionLocal

    db = SessionLocal()
    try:
        created = 0
        for org in ORGS:
            try:
                if seed_org(db, org, password):
                    created += 1
            except Exception:
                db.rollback()
                raise
        print(f"Done. {created} organisation(s) created, {len(ORGS) - created} skipped.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
