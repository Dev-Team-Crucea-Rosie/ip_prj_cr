# Sprint 1 Test Plan

Status values to use during execution: `Not Run`, `Pass`, `Fail`.

| Test ID | Feature | Steps | Expected Result | Status |
|---|---|---|---|---|
| BE-01 | Health check | 1. Start backend. 2. Send `GET /health`. | Response is 200 JSON with `status: "ok"` and `server: "running"`. | Not Run |
| BE-02 | DB status | 1. Start backend with valid `DATABASE_URL`. 2. Send `GET /db-status`. | Response is 200 JSON with `database: "connected"`. | Not Run |
| BE-03 | Register endpoint | 1. Send `POST /auth/register` with valid body. | Response is 201 with created `user` fields and no password hash in response. | Not Run |
| BE-04 | Login endpoint | 1. Send `POST /auth/login` with registered credentials. | Response is 200 with `token` and `user`. | Not Run |
| BE-05 | Protected route behavior | 1. Send `GET /auth/me` without token. 2. Send with valid bearer token. | First request is 401. Second request is 200 with `user`. | Not Run |
| BE-06 | Create project | 1. Send `POST /projects` with bearer token and project payload. | Response is 201 with created `project`. | Not Run |
| BE-07 | List projects | 1. Send `GET /projects`. | Response is 200 with `projects` array. | Not Run |
| BE-08 | Update project | 1. Send `PUT /projects/:id` with bearer token. | Response is 200 with updated `project`. | Not Run |
| BE-09 | Delete project | 1. Send `DELETE /projects/:id` with bearer token. | Response is 200 with deleted `project`. | Not Run |
| WEB-01 | Register page | 1. Open web app. 2. Go to Register. 3. Submit valid form. | Register request succeeds and user can proceed to login. | Not Run |
| WEB-02 | Login page | 1. Open Login page. 2. Submit valid credentials. | JWT token is saved in local storage and dashboard opens. | Not Run |
| WEB-03 | Dashboard access | 1. Login. 2. Verify dashboard screen. | Dashboard shows welcome area and projects section. | Not Run |
| WEB-04 | Project management UI | 1. Create project. 2. Edit project. 3. Delete project. | UI reflects CRUD operations and backend data updates. | Not Run |
| MOB-01 | Camera permission | 1. Open mobile app permission screen. 2. Trigger permission request. | Camera permission status displays granted or denied. | Not Run |
| MOB-02 | Volunteer profile screen | 1. Open profile screen. | First name, last name, email, and phone are visible. | Not Run |
| MOB-03 | Task list screen | 1. Open task list screen. | Task description, status, and event reference are visible. | Not Run |

## Notes

- In this repository snapshot there is no mobile app folder yet. Mobile tests remain planned and marked `Not Run` until mobile implementation is added.
