# Group 4 Students API

Our CS403 MCO1 project is a REST API for managing student records. It uses Express and PostgreSQL, with JWT authentication and bcrypt for password hashing. Swagger provides the API documentation and a way to test requests in the browser.

## Requirements

- <img src="https://cdn.simpleicons.org/nodedotjs/339933" width="20" height="20" alt="Node.js"> **Node.js** 20 or later
- <img src="https://cdn.simpleicons.org/npm/CB3837" width="20" height="20" alt="npm"> **npm**
- <img src="https://cdn.simpleicons.org/postgresql/4169E1" width="20" height="20" alt="PostgreSQL"> **PostgreSQL**
- <img src="https://cdn.simpleicons.org/git/F05032" width="20" height="20" alt="Git"> **Git**, if you will clone the repository

The commands below use Windows PowerShell. If `npm` is blocked by an execution-policy error, use `npm.cmd` instead.

## Setup

### 1. Install the dependencies

```powershell
git clone https://github.com/Demrev/G4CS403.git
cd G4CS403
npm install
```

If you already have the project, open its folder in a terminal and run `npm install`.

### 2. Create a database

Run this in pgAdmin's Query Tool or a PostgreSQL session:

```sql
CREATE DATABASE g4cs403;
```

You can use a different database name. Just use the same name for `DB_NAME` in your `.env` file. Your database user also needs permission to create and alter tables.

### 3. Set up the environment variables

If you do not have a `.env` file yet, copy the example:

```powershell
Copy-Item .env.example .env
```

Update the values for your database connection:

```dotenv
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=g4cs403
DB_USER=your_postgresql_username
DB_PASSWORD=your_postgresql_password

JWT_ACCESS_SECRET=replace_with_a_random_secret
JWT_REFRESH_SECRET=replace_with_a_different_random_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
```

Run this command twice to generate two different JWT secrets:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Use one result for `JWT_ACCESS_SECRET` and the other for `JWT_REFRESH_SECRET`.

Keep your actual credentials in `.env`. Only the placeholder values in `.env.example` should be committed to Git.

### 4. Run the server

```powershell
npm start
```

For development, you can use automatic restarts:

```powershell
npm run dev
```

The server checks the database connection and initializes the `students` and `refresh_tokens` tables before accepting requests. You still need to create the database yourself in step 2.

The default address is `http://localhost:3000`. If you change `PORT`, use that port in your requests. Press `Ctrl+C` to stop the server.

## Using Swagger

Start the server, then open [Swagger UI](http://localhost:3000/api-docs/).

Select an endpoint, click **Try it out**, enter the required values, and click **Execute**.

### Register and log in

Use `POST /auth/register` to create a test account:

```json
{
  "name": "Test Student",
  "course": "BSCS",
  "email": "student@example.com",
  "password": "TestPassword123!"
}
```

Then use `POST /auth/login` with the same email and password:

```json
{
  "email": "student@example.com",
  "password": "TestPassword123!"
}
```

Copy the `accessToken` from the response. Click **Authorize** in Swagger and paste the token without the `Bearer` prefix. Swagger adds that part automatically.

You can now test the student endpoints. Use the returned student ID when getting, updating, or deleting a record.

For requests outside Swagger, include this header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Refresh tokens and logout

When the access token expires, send the latest refresh token to `POST /auth/refresh`:

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

Save both new tokens and update the access token in Swagger's **Authorize** dialog.

To log out, send the latest refresh token to `POST /auth/logout` using the same JSON format. This revokes the refresh token. An access token that has already been issued remains valid until it expires.

## Endpoints

All paths use the base URL directly. There is no `/api` prefix.

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| POST | `/auth/register` | Register a student account | None |
| POST | `/auth/login` | Get access and refresh tokens | None |
| POST | `/auth/refresh` | Get a new token pair | Refresh token in the request body |
| POST | `/auth/logout` | Revoke a refresh token | Refresh token in the request body |
| GET | `/students` | Get all students | Access token |
| GET | `/students/{id}` | Get one student | Access token |
| PUT | `/students/{id}` | Update a student's name or course | Access token |
| DELETE | `/students/{id}` | Delete a student and their saved refresh tokens | Access token |

Student accounts are created through `/auth/register`. There is currently no `POST /students` route.

All logged-in users can access the student routes. Role-based access and ownership checks are not implemented.

After refreshing, the old refresh token is revoked, but the old access token remains valid until it expires.

## Input validation

- Name and course must be nonblank strings. The maximum lengths are 100 characters for name and 50 for course.
- Email must pass a basic format check and cannot exceed 150 characters.
- Password must be a nonblank string of no more than 72 UTF-8 bytes.
- Student IDs must contain decimal digits and be between 1 and 2,147,483,647.
- Updates must include `name`, `course`, or both. Omitted fields keep their current values. Empty strings and `null` are rejected.

## Response codes

| Code | Meaning |
| --- | --- |
| `200` | Request completed successfully |
| `201` | Student account created |
| `400` | Missing or invalid input, or malformed JSON |
| `401` | Missing, invalid, or expired credentials or token |
| `404` | Student or route not found |
| `409` | Email already registered |
| `500` | Database or other server error |

## Testing

Use test records when trying the API. Requests sent through Swagger change the database, including updates and deletions.

| Category | Test | Expected result |
| --- | --- | --- |
| Happy path | Register, log in, get students, update a record, and delete it | `201` for registration; `200` for the other requests |
| Missing fields | Register or update with `{}` | `400` |
| Invalid data | Register with an invalid email or update with `{"name": 123}` | `400` |
| Authentication | Clear Swagger authorization and call `GET /students` | `401` |
| Not found | Request a deleted student's ID with a valid access token | `404` |
| Edge cases | Send whitespace-only names, oversized fields, or a duplicate email | `400` for invalid fields; `409` for a duplicate email |

To check that records are saved, create a student and restart the server. Log in again and fetch the same student ID before deleting the record.

Automated validation tests are not included in this version. The `db:test` script points to a missing file, and `db:init` does not call the exported initialization function. For now, start the server to initialize the tables and use the checks above to test the API.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| Database connection fails | Make sure PostgreSQL is running, the database exists, and the database settings and permissions are correct. |
| Swagger shows old endpoints | Restart the server and refresh `/api-docs/`. |
| Protected requests return `401` | Log in again or refresh your token, then update Swagger authorization. |
| Registration returns `409` | Use another test email or log in to the existing account. |
| Port is already in use | Stop the process using that port or change `PORT` in `.env`. Use the new port in the Swagger URL. |
