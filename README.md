# Car Shop Demo

[![Application CI](https://github.com/okryvorotko/car-shop-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/okryvorotko/car-shop-demo/actions/workflows/ci.yml)

A deliberately small full-stack application used as the system under test for
the [Car Shop Test Automation](https://github.com/okryvorotko/test-car-shop)
portfolio project.

The application provides realistic authentication, catalog, cart, and order
flows without pretending to be a production commerce platform. Its purpose is
to make API, UI, CI/CD, reporting, Docker, AWS, and Terraform automation easy to
inspect and reproduce.

## Stack

- Backend: Node.js, Express, SQLite, JWT, and OpenAPI/Swagger
- Frontend: React and Vite
- Local runtime: Docker Compose
- Automated testing: maintained in the separate
  [test-car-shop](https://github.com/okryvorotko/test-car-shop) repository

## Quick start with Docker

Start the application from the project root:

```bash
docker compose up --build
```

Docker Compose supplies disposable local defaults. Override `BE_PORT`,
`JWT_SECRET`, or `VITE_BE_HOST` in your shell or a root `.env` file when needed.
The nested `.env.example` files document the equivalent configuration for
running each service outside Docker.

Available endpoints:

| Service | URL |
| --- | --- |
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| Interactive API documentation | http://localhost:4000/api-docs |
| OpenAPI document | http://localhost:4000/openapi.json |

Stop the application with:

```bash
docker compose down
```

## Configuration

`backend/.env`:

```dotenv
BE_PORT=4000
JWT_SECRET=replace-with-a-local-development-secret
```

`frontend/.env`:

```dotenv
VITE_BE_HOST=http://localhost:4000/
```

The committed `.env.example` files contain safe local defaults. Actual `.env`
files are ignored by Git and must not contain reusable credentials.

## Run without Docker

Install the locked dependencies:

```bash
cd backend
npm ci
cd ../frontend
npm ci
```

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Vite may select a different local frontend port when port 5173 is occupied. Use
the URL printed in the frontend terminal.

## Test-support boundary

The application exposes `/admin/reset` so the companion automation project can
restore deterministic fixture data. The endpoint is intentionally
unauthenticated for this disposable local test system and would not be an
acceptable production design.

The automated suite, diagnostics, Allure reports, and temporary AWS deployment
are documented in
[test-car-shop](https://github.com/okryvorotko/test-car-shop).
