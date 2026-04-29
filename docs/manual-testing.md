# Sprint 1 Manual Testing Guide

## Backend

1. Start backend in `server`:
```bash
npm run dev
```

2. Check server health:
```bash
curl -sS http://127.0.0.1:5000/health
```

3. Check database status:
```bash
curl -sS http://127.0.0.1:5000/db-status
```

4. Register user:
```bash
curl -sS -X POST http://127.0.0.1:5000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Sprint","lastName":"User","email":"sprint1@example.com","phone":"123","password":"pass1234","isCoordinator":true,"isAdministrator":false}'
```

5. Login user:
```bash
curl -sS -X POST http://127.0.0.1:5000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"sprint1@example.com","password":"pass1234"}'
```

6. Save token from login response and test protected route:
```bash
curl -sS http://127.0.0.1:5000/auth/me -H "Authorization: Bearer <TOKEN>"
```

7. Project CRUD:
```bash
curl -sS http://127.0.0.1:5000/projects
curl -sS -X POST http://127.0.0.1:5000/projects -H 'Content-Type: application/json' -H "Authorization: Bearer <TOKEN>" -d '{"name":"Project A","description":"Desc A"}'
curl -sS -X PUT http://127.0.0.1:5000/projects/<ID> -H 'Content-Type: application/json' -H "Authorization: Bearer <TOKEN>" -d '{"name":"Project A2","description":"Desc A2"}'
curl -sS -X DELETE http://127.0.0.1:5000/projects/<ID> -H "Authorization: Bearer <TOKEN>"
```

## Web

1. Start web app in `client`:
```bash
npm run dev
```

2. Open the Vite URL shown in terminal.

3. Register flow:
- Open Register tab.
- Fill first name, last name, email, phone, password.
- Submit and verify it returns to login flow.

4. Login flow:
- Login with registered credentials.
- Verify dashboard opens.
- Verify token exists in browser local storage key `crs3_token`.

5. Project flow:
- Create a project in dashboard.
- Edit the same project.
- Delete the project.
- Verify table updates after each operation.

## Mobile

- There is currently no mobile project folder in this repository.
- Execute mobile manual testing steps after a React Native app is added:
  - App start check
  - Camera permission status check
  - Volunteer profile screen check
  - Task list screen check
