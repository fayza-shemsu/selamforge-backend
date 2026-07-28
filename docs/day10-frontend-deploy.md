# Day 10 Frontend Deploy Checklist

Selam owns this checklist once the frontend repository is connected to Vercel.

## Required Environment Variable

Set this in Vercel Project Settings > Environment Variables:

```text
NEXT_PUBLIC_API_URL=https://<fayza-staging-api-url>
```

Use Fayza's live FastAPI staging URL after her Azure App Service deployment is complete. Keep local development on:

```text
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Deploy Steps

1. Connect the frontend repository to Vercel.
2. Confirm the build command is `npm run build`.
3. Confirm the install command is `npm install`.
4. Set `NEXT_PUBLIC_API_URL` for Production and Preview.
5. Deploy the latest reviewed branch after it is merged.
6. Smoke-test `/login`, `/register`, `/dashboard`, `/dashboard/employees`, and `/dashboard/org-units`.
7. Register a new organization against staging once Fayza's `/api/v1/auth/register` endpoint and CORS are live.
8. Log out, log back in, and test a wrong password response against staging.

## Current Blockers

- Vercel connection requires Selam's project/account access.
- Live auth testing requires Fayza's staging API URL and CORS configuration.
- Employee and org-unit write flows still use mock/local state until Fayza's endpoints are deployed.
