# Selam Task Status

## Remote And Local Baseline

Reviewed `fayza-shemsu/selamforge-backend` through `origin/main` commit `209efa9` (Day 19 attendance). That history is merged into the current local feature branch. The local database URL points to an external Neon host; do not run migrations, seeds, or integration tests against it unless it is confirmed to be a disposable development database.

## Day-by-Day Work Review

| Day | Work in Git history | Status in this branch |
| --- | --- | --- |
| 1 | Infrastructure skeleton and frontend foundation | Present |
| 2 | Tenant claims and org/user migrations | Present |
| 3 | Register/login endpoints and JWT | Present; regression tests retained |
| 4 | Tenant DB dependency and identity debug route | Present |
| 5 | Org-unit model, CRUD, and tree | Present; UI now reads/writes API |
| 6 | Employee model, CRUD, pagination, and soft delete | Present; list/detail/create/edit now use API |
| 7 | Manager relationship and reporting-chain endpoints | Present; employee detail now reads chain API |
| 8 | Transactional event bus and worker | Worker is now scheduled during app startup |
| 9 | Employee-created handler and initial leave balance | Present; worker activation makes it process pending events |
| 10 | Selam frontend flows and deployment checklist | Main Phase 1 flows integrated; staging deploy still needs account/API access |
| 11 | Environment-guarded demo seed script | Present; not run against external DB |
| 12 | Role-based access control | Present |
| 13 | Two-tenant isolation tests and CI | Present; require disposable PostgreSQL to run locally |
| 14 | CSV employee import and row-level errors | Present; frontend now uploads to API |
| 15 | Demo readiness, CORS, Swagger auth, safe org-unit deletion | Present |
| 16 | Demo script | Present |
| 17 | Annual leave entitlement formula and tests | Present |
| 18 | Scheduled accrual and leave-balance endpoint | Present; UI now reads endpoint |
| 19 | Attendance log model and clock-in/out | Present; history endpoint/UI and lifecycle tests added |

Phase 2 pages (Talent, Learning, CFR, OKR, Payroll, Compensation) were added as sample dashboard content, not complete business workflows. They remain incomplete until the business rules, data fields, roles, and approval flows are agreed and backend contracts are specified.

## Phase 1 Complete In This Branch

- Register/login and HTTP-only token session.
- Tenant-aware employee and org-unit backend APIs, RBAC, reporting chain, and CSV import.
- Employee list/search, detail, create/edit, CSV import, leave-balance display, dashboard summary, reports, and team directory connected to backend APIs.
- Org-unit tree, statistics, create, and edit connected to backend APIs.
- Attendance clock-in/out and history connected to tenant-scoped backend APIs; history filters by date and employee.
- Employee-created events are processed by the app scheduler, and leave accrual remains scheduled nightly.
- Generic PostgreSQL URLs select the declared psycopg2 driver for both app and Alembic.

## Still Unfinished Or Dependent

- Phase 2 Talent Acquisition, Learning, CFR, OKR, Payroll, and Compensation pages still display sample/static values. There are no corresponding business models or endpoints in the backend; real workflows need agreed field definitions, permissions, and business rules before they can be implemented without guessing.
- Copilot is a local echo response, not an AI integration. It needs an approved provider, credentials, and backend request contract.
- Attendance stores coordinates but has no configured geofence rules or server-side location validation. The interface reports location capture, not a validated geofence decision.
- Settings/branding is presentation-only; no organization settings or file-storage API exists yet.
- Vercel/Azure staging smoke tests require account access and a deployed API URL.

## Validation

- `npm run typecheck`: passed.
- `npm run build`: passed.
- `pytest tests/test_leave.py tests/test_scheduler.py`: passed (10 tests).
- `alembic upgrade head --sql`: generated the full migration chain offline.
- Attendance and tenant integration tests require a disposable PostgreSQL database. Docker is installed but its local daemon is not running; the configured Neon database was not modified.
