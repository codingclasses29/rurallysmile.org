# Phase 2.4 – Professional Backend Foundation

## Architecture

```
Frontend → Controller → Service → Repository → MongoDB
```

## New Modules

| Area | Files |
|------|--------|
| Config | `env.js`, `index.js`, `cloudinary.js`, `mail.js`, `db.js` |
| Repositories | student, admin, result |
| Services | auth, student, result, mail, otp, pdf, qr, upload |
| Generators | `RSF26######`, `RTN26#####` |
| Logger | `utils/logger.js` (Winston) |

## Generators

- Registration: `RSF26124589`
- Roll Number: `RTN2612345`

## Health

`GET /api/v1/health` → `{ success, message: "Server Running", time }`
