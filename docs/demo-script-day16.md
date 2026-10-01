# SelamForge — Demo Checkpoint 1 (Day 16) — Backend Script

Total target: **10 minutes**. Fayza presents backend (about 6 min), Selam presents UI (about 4 min).
Rule: capture feedback as backlog, never fix live.

## Before the call (T-60 min, joint smoke test with Selam)
- [ ] Latest `main` deployed to staging, CI green
- [ ] Staging warm: `curl -s https://selamforge-backend-staging.azurewebsites.net/health` (or `/docs`) loads fast; Always On enabled
- [ ] Vercel frontend deployed, logging in works (no CORS error in browser console)
- [ ] Tokens ready in the terminal (see setup below)
- [ ] Browser tabs open: `/docs`, frontend login, this script

## Setup (run once, off-camera)
```bash
B=https://selamforge-backend-staging.azurewebsites.net/api/v1
read -s -p "Seed password: " PW; echo
login() { curl -s -X POST $B/auth/login -H "Content-Type: application/json" \
  -d "{\"email\":\"$1\",\"password\":\"$PW\"}" | python -c "import sys,json; print(json.load(sys.stdin)['access_token'])"; }
TA=$(login tigist.haile@lalibelacoffee.et)      # Org A admin (Lalibela Coffee)
TB=$(login bereket.wolde@abaylogistics.et)      # Org B admin (Abay Logistics)
TE=$(login bethlehem.negash@lalibelacoffee.et)  # Org A plain employee
```

## Part 1 — Tenancy isolation (about 3 min)
**Say:** "Every row carries an org id, and every query is scoped by the token, not by anything the client sends."

1. List employees as Org A, then Org B. Different people, different counts:
```bash
   curl -s $B/employees -H "Authorization: Bearer $TA" | python -m json.tool | head -40
   curl -s $B/employees -H "Authorization: Bearer $TB" | python -m json.tool | head -40
```
2. Take one Org A employee id (`<A_ID>`) and request it with Org B's token. Expect **404, not 403**, so the API does not even confirm the record exists:
```bash
   curl -s -i $B/employees/<A_ID> -H "Authorization: Bearer $TB" | head -1
```
3. Try a cross-org write (PATCH or DELETE `<A_ID>` with Org B token). Expect 404 and confirm Org A's data is unchanged.
4. **Say:** "These cases are also automated in CI (Day 13 integration tests), so a leak breaks the build."

## Part 2 — CRUD flow (about 2 min)
1. Create an org unit (admin), create an employee in it.
2. Read it back, update a field (e.g. salary).
3. Delete the employee (admin only). **Say:** "This is a soft delete — the record moves to inactive status rather than disappearing, so payroll history stays intact." Confirm with a GET: status is now `inactive`, not a 404.
4. Deleting an org unit that still has employees returns 409, not a crash — deliberate guardrail.

## Part 3 — RBAC (about 1 min)
- Same DELETE with the employee token `$TE` returns **403**:
```bash
  curl -s -i -X DELETE $B/employees/<ID> -H "Authorization: Bearer $TE" | head -1
```
- **Say:** "Roles come from the token via `require_role`, layered on the tenancy dependency."

## Part 4 — CSV import (about 1 min, hand over to Selam for the UI)
- Show the upload response shape: `{created, errors:[{row, field, message}]}`.
- Zero-side-effect check (both rows invalid, nothing is created):
```bash
  printf 'first_name,last_name,email,hire_date,base_salary_etb\n,NoName,x@x.et,2024-01-01,1000\nTigist,Haile,tigist.haile@lalibelacoffee.et,2024-01-01,1000\n' > check.csv
  curl -s -X POST $B/employees/import -H "Authorization: Bearer $TA" -F "file=@check.csv"; rm check.csv
```
  Expected: `created: 0`, an error at row 2 (`first_name`) and at row 3 (`email`).
- Selam then demos the same in the UI dropzone.

## Split with Selam
| Segment | Presenter |
|---|---|
| Intro and architecture (30 s) | Fayza |
| Isolation proof, CRUD, RBAC (about 5 min) | Fayza |
| Dashboard shell, employee list/detail/create | Selam |
| CSV import UI (preview, error table, success count) | Selam |
| Wrap-up and backlog | Both |

## If something breaks live
- 503 or slow first call: staging was cold. Refresh and continue, do not debug on camera.
- Auth 401: re-run the `login` line for that token.
- Anything else: say "noted for backlog" and move to the next section.

## Timing rehearsal log
| Run | Total time | What broke |
|---|---|---|
| 1 | | |
| 2 | | |
