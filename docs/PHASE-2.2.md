# Phase 2.2 – Authentication & Authorization

## Flow

```
Admin Login → bcrypt verify → Access Token (15m) + Refresh Token (7d)
           → HTTP-only cookies → protect + authorize → Protected routes
```

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/login` | Public | Admin login |
| POST | `/api/v1/auth/logout` | Public | Clear cookies |
| POST | `/api/v1/auth/refresh` | Cookie | New access token |
| GET | `/api/v1/auth/profile` | protect | Logged-in admin |
| GET | `/api/v1/admin/dashboard` | protect + roles | Admin dashboard |

## Roles

- `SUPER_ADMIN` – all permissions
- `ADMIN` – students, results, admit, notices
- `COORDINATOR` – registration / verification

## Cookies

- `accessToken` – 15 minutes, httpOnly
- `refreshToken` – 7 days, httpOnly
- `secure` enabled only in production (localhost uses lax + non-secure)
