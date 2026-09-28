"""CSV import: valid rows commit, invalid rows are reported with row + field."""
import uuid

API = "/api/v1"
HEADER = "first_name,last_name,email,hire_date,base_salary_etb,is_ethiopian_national"


def _upload(client, headers, csv_text):
    return client.post(
        f"{API}/employees/import",
        files={"file": ("employees.csv", csv_text.encode("utf-8"), "text/csv")},
        headers=headers,
    )


def _emails(client, headers):
    r = client.get(f"{API}/employees", params={"page_size": 100}, headers=headers)
    assert r.status_code == 200
    return {e["email"] for e in r.json()["items"]}


def test_mixed_csv_commits_valid_rows_and_reports_the_bad_ones(tenants):
    client, a = tenants.client, tenants.a
    tag = uuid.uuid4().hex[:8]
    existing_email = sorted(_emails(client, a.headers))[0]
    rows = [
        f"Abel,Import,abel-{tag}@tenancytest.et,2024-03-01,25000,true",         # row 2: valid
        f",NoName,noname-{tag}@tenancytest.et,2024-03-01,25000,true",            # row 3: first_name missing
        f"Bad,Date,baddate-{tag}@tenancytest.et,not-a-date,25000,true",          # row 4: bad hire_date
        f"Dup,Email,abel-{tag}@tenancytest.et,2024-03-02,25000,true",            # row 5: repeats row 2's email
        f"Sara,Import,sara-{tag}@tenancytest.et,2024-03-05,30000,false",         # row 6: valid
        f"Exists,Already,{existing_email},2024-03-05,30000,true",                # row 7: email already in the org
    ]
    r = _upload(client, a.headers, HEADER + "\n" + "\n".join(rows) + "\n")
    assert r.status_code == 200, r.text
    body = r.json()

    assert body["created"] == 2
    reported = {(e["row"], e["field"]) for e in body["errors"]}
    assert (3, "first_name") in reported
    assert (4, "hire_date") in reported
    assert (5, "email") in reported
    assert (7, "email") in reported
    assert all(e["message"] for e in body["errors"])

    # the valid rows really were saved, the invalid ones were not
    emails = _emails(client, a.headers)
    assert f"abel-{tag}@tenancytest.et" in emails
    assert f"sara-{tag}@tenancytest.et" in emails
    assert f"noname-{tag}@tenancytest.et" not in emails
    assert f"baddate-{tag}@tenancytest.et" not in emails


def test_missing_required_column_is_rejected_with_400(tenants):
    r = _upload(tenants.client, tenants.a.headers, "first_name,last_name\nAbel,Import\n")
    assert r.status_code == 400
    assert "email" in r.json()["detail"]


def test_import_cannot_reference_another_orgs_records(tenants):
    client, a, b = tenants.client, tenants.a, tenants.b
    tag = uuid.uuid4().hex[:8]
    csv_text = (
        HEADER + ",manager_id,org_unit_id\n"
        f"Leak,One,leak1-{tag}@tenancytest.et,2024-03-01,25000,true,{b.employee_ids[0]},\n"
        f"Leak,Two,leak2-{tag}@tenancytest.et,2024-03-01,25000,true,,{b.unit_id}\n"
    )
    r = _upload(client, a.headers, csv_text)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["created"] == 0
    reported = {(e["row"], e["field"]) for e in body["errors"]}
    assert (2, "manager_id") in reported
    assert (3, "org_unit_id") in reported
    emails = _emails(client, a.headers)
    assert f"leak1-{tag}@tenancytest.et" not in emails
    assert f"leak2-{tag}@tenancytest.et" not in emails


def test_import_requires_a_login(tenants):
    r = tenants.client.post(
        f"{API}/employees/import",
        files={"file": ("employees.csv", HEADER.encode("utf-8"), "text/csv")},
    )
    assert r.status_code == 401
