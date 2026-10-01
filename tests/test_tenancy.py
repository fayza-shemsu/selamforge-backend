"""Cross-organisation isolation tests.

Every test runs twice: org A acting against org B, then B against A.
Rule of thumb: another org's record must look exactly like a record that does not
exist (404, never 403), and no attempt may change or reveal anything.
"""
import uuid

API = "/api/v1"
REJECTED = {400, 404, 422}


def _ids(items):
    return {item["id"] for item in items}


def _new_employee(me, **overrides):
    body = {
        "org_unit_id": me.unit_id,
        "manager_id": None,
        "first_name": "Leak",
        "last_name": "Test",
        "email": f"leak-{uuid.uuid4().hex[:8]}@tenancytest.et",
        "hire_date": "2024-02-01",
        "base_salary_etb": 15000,
        "is_ethiopian_national": True,
    }
    body.update(overrides)
    return body


# ---- listing ---------------------------------------------------------------

def test_employee_list_shows_only_own_org(pair):
    client, me, other = pair
    r = client.get(f"{API}/employees", params={"page_size": 100}, headers=me.headers)
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == len(me.employee_ids)
    assert _ids(body["items"]) == set(me.employee_ids)
    assert not _ids(body["items"]) & set(other.employee_ids)


def test_employee_search_matches_name_and_email_within_tenant(pair):
    client, me, other = pair
    employee = client.get(
        f"{API}/employees/{me.employee_ids[0]}", headers=me.headers
    ).json()
    for term in (employee["first_name"], employee["email"]):
        response = client.get(
            f"{API}/employees",
            params={"search": term, "page_size": 100},
            headers=me.headers,
        )
        assert response.status_code == 200, response.text
        body = response.json()
        assert body["total"] == 1
        assert body["items"][0]["id"] == me.employee_ids[0]
        assert body["items"][0]["id"] not in other.employee_ids


def test_filtering_by_another_orgs_unit_returns_nothing(pair):
    client, me, other = pair
    r = client.get(f"{API}/employees", params={"org_unit_id": other.unit_id}, headers=me.headers)
    assert r.status_code == 200
    assert r.json()["total"] == 0


def test_org_unit_list_and_tree_show_only_own_org(pair):
    client, me, other = pair
    listed = client.get(f"{API}/org-units", headers=me.headers)
    assert listed.status_code == 200
    assert [u["id"] for u in listed.json()] == [me.unit_id]
    tree = client.get(f"{API}/org-units/tree", headers=me.headers)
    assert tree.status_code == 200
    assert [n["id"] for n in tree.json()] == [me.unit_id]


# ---- direct object reference: must be 404, not 403 --------------------------

def test_reading_another_orgs_employee_returns_404_not_403(pair):
    client, me, other = pair
    victim = other.employee_ids[1]
    assert client.get(f"{API}/employees/{victim}", headers=me.headers).status_code == 404
    assert client.get(f"{API}/employees/{victim}/reports-chain", headers=me.headers).status_code == 404


def test_direct_reports_of_another_orgs_manager_are_empty(pair):
    client, me, other = pair
    r = client.get(f"{API}/employees/{other.employee_ids[0]}/direct-reports", headers=me.headers)
    assert r.status_code == 200
    assert r.json()["direct_reports"] == []


# ---- cross-org writes -------------------------------------------------------

def test_writing_to_another_orgs_employee_is_404_and_changes_nothing(pair):
    client, me, other = pair
    victim = other.employee_ids[1]
    assert client.patch(
        f"{API}/employees/{victim}", json={"first_name": "Hacked"}, headers=me.headers
    ).status_code == 404
    assert client.delete(f"{API}/employees/{victim}", headers=me.headers).status_code == 404

    still_there = client.get(f"{API}/employees/{victim}", headers=other.headers)
    assert still_there.status_code == 200
    assert still_there.json()["first_name"] != "Hacked"
    listing = client.get(f"{API}/employees", params={"page_size": 100}, headers=other.headers)
    assert listing.json()["total"] == len(other.employee_ids)


def test_another_orgs_org_unit_cannot_be_changed(pair):
    client, me, other = pair
    assert client.patch(
        f"{API}/org-units/{other.unit_id}", json={"name": "Hacked"}, headers=me.headers
    ).status_code == 404
    assert client.delete(f"{API}/org-units/{other.unit_id}", headers=me.headers).status_code == 404

    units = client.get(f"{API}/org-units", headers=other.headers).json()
    assert [u["id"] for u in units] == [other.unit_id]
    assert units[0]["name"] != "Hacked"


def test_org_unit_parent_can_be_cleared_and_cycles_are_rejected(pair):
    client, me, _ = pair
    child = client.post(
        f"{API}/org-units",
        json={"name": "Child", "unit_type": "team", "parent_unit_id": me.unit_id},
        headers=me.headers,
    )
    assert child.status_code == 200, child.text
    child_id = child.json()["id"]

    cleared = client.patch(
        f"{API}/org-units/{child_id}",
        json={"parent_unit_id": None},
        headers=me.headers,
    )
    assert cleared.status_code == 200, cleared.text
    assert cleared.json()["parent_unit_id"] is None

    self_parent = client.patch(
        f"{API}/org-units/{child_id}",
        json={"parent_unit_id": child_id},
        headers=me.headers,
    )
    assert self_parent.status_code == 400

    descendant_cycle = client.patch(
        f"{API}/org-units/{me.unit_id}",
        json={"parent_unit_id": child_id},
        headers=me.headers,
    )
    assert descendant_cycle.status_code == 400
    client.delete(f"{API}/org-units/{child_id}", headers=me.headers)


def test_employee_email_cannot_be_reused_on_update(pair):
    client, me, _ = pair
    employees = [
        client.get(f"{API}/employees/{employee_id}", headers=me.headers).json()
        for employee_id in me.employee_ids[:2]
    ]
    response = client.patch(
        f"{API}/employees/{employees[1]['id']}",
        json={"email": employees[0]["email"].upper()},
        headers=me.headers,
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "employee with this email already exists"


# ---- references: a record may not point at another org's records -------------

def test_cannot_create_employee_under_another_orgs_manager(pair):
    client, me, other = pair
    r = client.post(
        f"{API}/employees",
        json=_new_employee(me, manager_id=other.employee_ids[0]),
        headers=me.headers,
    )
    assert r.status_code in REJECTED, r.text


def test_cannot_create_employee_in_another_orgs_unit(pair):
    client, me, other = pair
    r = client.post(
        f"{API}/employees",
        json=_new_employee(me, org_unit_id=other.unit_id),
        headers=me.headers,
    )
    assert r.status_code in REJECTED, r.text


def test_cannot_reassign_employee_to_another_orgs_manager(pair):
    client, me, other = pair
    r = client.patch(
        f"{API}/employees/{me.employee_ids[1]}",
        json={"manager_id": other.employee_ids[0]},
        headers=me.headers,
    )
    assert r.status_code in REJECTED, r.text


def test_cannot_parent_org_unit_under_another_orgs_unit(pair):
    client, me, other = pair
    r = client.post(
        f"{API}/org-units",
        json={"name": "Leak", "unit_type": "team", "parent_unit_id": other.unit_id},
        headers=me.headers,
    )
    assert r.status_code in REJECTED, r.text


# ---- controls: the same calls with OWN references must still work -----------

def test_references_inside_own_org_still_work(pair):
    client, me, other = pair
    created = client.post(
        f"{API}/employees",
        json=_new_employee(me, manager_id=me.employee_ids[0]),
        headers=me.headers,
    )
    assert created.status_code == 200, created.text
    unit = client.post(
        f"{API}/org-units",
        json={"name": "Child", "unit_type": "team", "parent_unit_id": me.unit_id},
        headers=me.headers,
    )
    assert unit.status_code == 200, unit.text
    # clean up so the list tests stay exact
    client.delete(f"{API}/employees/{created.json()['id']}", headers=me.headers)
    client.delete(f"{API}/org-units/{unit.json()['id']}", headers=me.headers)


def test_requests_without_a_valid_token_are_rejected(tenants):
    client = tenants.client
    assert client.get(f"{API}/employees").status_code == 401
    bad = {"Authorization": "Bearer not-a-real-token"}
    assert client.get(f"{API}/employees", headers=bad).status_code == 401
