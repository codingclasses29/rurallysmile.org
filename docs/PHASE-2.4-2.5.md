# Phase 2.4 + 2.5 – Backend Foundation & REST API

## Architecture

```
Client → Router → Controller → Service → Repository → MongoDB
```

## Base URL

`/api/v1`

## Modules

| Prefix | File |
|--------|------|
| `/auth` | auth.routes.js |
| `/student` | student.routes.js |
| `/registration` | registration.routes.js |
| `/admit` | admit.routes.js |
| `/result` | result.routes.js |
| `/marksheet` | marksheet.routes.js |
| `/center` | examCenter.routes.js |
| `/notice` | notice.routes.js |
| `/gallery` | gallery.routes.js |
| `/dashboard` | dashboard.routes.js |
| `/upload` | upload.routes.js |
| `/settings` | setting.routes.js |
| `/health` | health check |

## Phase 2.4 Services

- Cloudinary upload, Nodemailer, OTP, QR, PDF
- Registration No: `RSF26######`
- Roll No: `RTN26#####`
- Winston logger + env validation
