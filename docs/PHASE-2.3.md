# Phase 2.3 – Validation, Error Handling & Security

## Middleware Stack (order)

1. JSON / URL encoded / Cookie parser  
2. CORS (credentials)  
3. Helmet  
4. Compression  
5. Mongo sanitize  
6. XSS sanitize  
7. HPP  
8. Morgan logger  
9. Rate limit (100 / 15 min)  
10. Routes  
11. 404 notFound  
12. Global errorHandler  

## Validators

| File | Used by |
|------|---------|
| `validators/auth.validator.js` | `POST /auth/login` |
| `validators/student.validator.js` | `POST /student/register` |
| `validators/result.validator.js` | Result create / get |
| `validators/notice.validator.js` | Notice create / update |

## Response Format

**Success**
```json
{ "success": true, "message": "...", "data": {} }
```

**Validation Error**
```json
{
  "success": false,
  "message": "Validation Failed",
  "errors": [{ "field": "email", "msg": "Enter Valid Email" }]
}
```

## Note on XSS

`xss-clean` is deprecated. Project uses `middleware/xss.middleware.js` (custom sanitizer) with the same purpose.
