# Phase 1 Frontend Status

## Complete In Frontend

- Auth screens with validation and backend-shaped request payloads.
- httpOnly cookie session helpers and central 401 handling.
- Role-aware dashboard protection and admin route guard.
- Dashboard shell with all module navigation entries.
- Org unit tree and create/edit modal against the agreed tree shape.
- Employee list, detail, reporting-chain display, and create/edit form.
- Employee CSV import preview with per-row error display.
- Settings page with org profile and branding upload control.
- Leave balance card on employee detail.
- Clock-in/out panel with geolocation permission handling and geofence warning.
- Attendance history table with employee/date filters.
- AI Copilot chat shell wired to a local echo route.

## Waiting On Backend Or Accounts

- Employee, org-unit, leave, attendance, CSV import, and copilot real endpoints are not registered in the backend currently merged to `main`.
- Vercel deployment requires Selam's Vercel/project access.
- Live staging auth testing requires Fayza's deployed API URL and CORS settings.

## Local Backend Env

The backend `.env` is present locally and ignored by git. Do not commit secrets.
