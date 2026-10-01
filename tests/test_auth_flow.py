import uuid

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_register_then_login_works():
    email = f"qa-{uuid.uuid4().hex[:8]}@example.com"
    password = "StrongPass123!"
    payload = {"org_name": "QA Org", "email": email, "password": password}

    register_response = client.post("/api/v1/auth/register", json=payload)
    assert register_response.status_code == 200, register_response.text
    register_data = register_response.json()
    assert register_data["token_type"] == "bearer"
    assert register_data["access_token"]

    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert login_response.status_code == 200, login_response.text
    login_data = login_response.json()
    assert login_data["token_type"] == "bearer"
    assert login_data["access_token"]


def test_duplicate_registration_is_rejected():
    email = f"qa-{uuid.uuid4().hex[:8]}@example.com"
    password = "StrongPass123!"
    payload = {"org_name": "QA Org", "email": email, "password": password}

    first = client.post("/api/v1/auth/register", json=payload)
    assert first.status_code == 200, first.text

    second = client.post("/api/v1/auth/register", json=payload)
    assert second.status_code == 400, second.text
    assert second.json()["detail"] == "email already registered"


def test_protected_debug_route_uses_token_claims():
    email = f"qa-{uuid.uuid4().hex[:8]}@example.com"
    password = "StrongPass123!"

    register_response = client.post(
        "/api/v1/auth/register",
        json={"org_name": "Protected Org", "email": email, "password": password},
    )
    assert register_response.status_code == 200, register_response.text
    token = register_response.json()["access_token"]

    protected_response = client.get(
        "/api/v1/_debug/whoami",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert protected_response.status_code == 200, protected_response.text
    payload = protected_response.json()
    assert payload["role"] == "admin"
    assert payload["org_id"]
    assert payload["user_id"]

    missing_token = client.get("/api/v1/_debug/whoami")
    assert missing_token.status_code == 401, missing_token.text
