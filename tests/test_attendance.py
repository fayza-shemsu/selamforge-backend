from datetime import date


API = "/api/v1"


def test_clock_in_history_and_clock_out_are_persisted(tenants):
    client, tenant = tenants.client, tenants.a
    employee_id = tenant.employee_ids[1]

    clock_in = client.post(
        f"{API}/attendance/clock-in",
        json={"employee_id": employee_id, "geofence_lat": 9.03, "geofence_lng": 38.74},
        headers=tenant.headers,
    )
    assert clock_in.status_code == 200, clock_in.text
    log_id = clock_in.json()["id"]
    assert clock_in.json()["clock_out_at"] is None

    duplicate_clock_in = client.post(
        f"{API}/attendance/clock-in",
        json={"employee_id": employee_id},
        headers=tenant.headers,
    )
    assert duplicate_clock_in.status_code == 409

    history = client.get(
        f"{API}/attendance",
        params={"employee_id": employee_id, "page": 1, "page_size": 10},
        headers=tenant.headers,
    )
    assert history.status_code == 200, history.text
    assert history.json()["total"] >= 1
    assert any(log["id"] == log_id for log in history.json()["items"])
    assert date.fromisoformat(history.json()["items"][0]["clock_in_at"][:10])

    clock_out = client.post(
        f"{API}/attendance/clock-out",
        json={"employee_id": employee_id},
        headers=tenant.headers,
    )
    assert clock_out.status_code == 200, clock_out.text
    assert clock_out.json()["clock_out_at"] is not None

    duplicate_clock_out = client.post(
        f"{API}/attendance/clock-out",
        json={"employee_id": employee_id},
        headers=tenant.headers,
    )
    assert duplicate_clock_out.status_code == 409


def test_attendance_history_and_clocking_are_tenant_scoped(pair):
    client, tenant, other = pair
    other_employee_id = other.employee_ids[0]

    clock_in = client.post(
        f"{API}/attendance/clock-in",
        json={"employee_id": other_employee_id},
        headers=tenant.headers,
    )
    assert clock_in.status_code == 404

    history = client.get(
        f"{API}/attendance",
        params={"employee_id": other_employee_id},
        headers=tenant.headers,
    )
    assert history.status_code == 200, history.text
    assert history.json()["total"] == 0
    assert history.json()["items"] == []


def test_attendance_requires_authentication(tenants):
    assert tenants.client.get(f"{API}/attendance").status_code == 401