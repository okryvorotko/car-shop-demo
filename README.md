# Car Shop Demo

## Launch with Docker

From the project root, start the app with Docker Compose:

```sh
docker compose up --build
```

Then open the frontend at:

```text
http://localhost:3000
```

The backend API runs at:

```text
http://localhost:4000
```

## Environment Files

Docker Compose expects these files to exist:

- `backend/.env`
- `frontend/.env`

The backend environment file should define:

```sh
BE_PORT=4000
JWT_SECRET=your-secret-value
```

The frontend environment file should define:

```sh
VITE_BE_HOST=http://localhost:4000/
```

## Useful Docker Commands

Stop the app:

```sh
docker compose down
```

Rebuild from scratch if dependencies or Dockerfiles changed:

```sh
docker compose build --no-cache
docker compose up
```

## Local Development Without Docker

Install dependencies in both apps:

```sh
cd backend
npm install
cd ../frontend
npm install
```

Start the backend:

```sh
cd backend
npm run dev
```

Start the frontend in a second terminal:

```sh
cd frontend
npm run dev
```

When running locally, Vite may print a different frontend URL. Use the URL shown in the frontend terminal.
