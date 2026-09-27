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

## Selam Task Status

### Completed in this repo

- Auth screens, validation, and request payloads are in place.
- Session handling with HTTP-only cookie helpers and central 401 handling is working.
- Dashboard shell and role-aware route protection are implemented.
- Org unit tree, create/edit flows, and employee management screens are present.
- CSV import preview and validation flow are implemented.
- Attendance and clock-in/out UI are implemented.
- AI Copilot chat shell is connected to the local echo route.
- The app builds successfully with `npm run build`.

### Still blocked by dependent work

- Real employee, org-unit, leave, attendance, CSV import, and copilot endpoints must be registered by the backend team before full live integration.
- Production deployment to Vercel requires Selam's project access.
- Live staging auth testing requires Fayza's deployed API URL and CORS configuration.

### Non-blocked work completed now

- Verified the project is building cleanly.
- Documented the exact completed vs. pending tasks in this guide.
- Removed the unneeded local DB check script that contained connection details and should not remain in the repo.

### Recommended order for the next steps

1. Finish any frontend-only cleanup and UX polish that does not depend on backend routes.
2. Keep the live API integration blocked until Fayza's backend routes are merged and deployed.
3. Once the API is live, test write flows, login/register, and attendance routes against staging.
4. After the API is trustworthy, connect Vercel and deploy the reviewed branch.
