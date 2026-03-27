# TaskFlow - Full Stack Task Management System

![CI Pipeline](https://github.com/hemabhi26/taskflow/actions/workflows/ci.yml/badge.svg)

A full-stack Task Management System with role-based access control, JWT authentication, MySQL persistence, Dockerized services, and GitHub Actions CI/CD.

---

## Tech Stack

### Backend
- Java 25
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT (jjwt)
- MySQL 8

### Frontend
- React + Vite
- React Router
- Axios
- Tailwind CSS

### DevOps
- Docker + Docker Compose
- GitHub Actions CI/CD
- Swagger UI API Docs

---

## Project Structure
```
taskflow/
├── backend/
│   ├── src/main/java/com/taskflow/backend/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   ├── src/main/resources/
│   │   └── db/migration/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── pages/
│   ├── Dockerfile
│   └── package.json
├── .github/workflows/ci.yml
├── docker-compose.yml
├── .env
└── .env.example
```

---

## Core Features

### Authentication & Authorization
- User registration and login with JWT token
- Role-based access control:
  - **ADMIN** — full access
  - **USER** — limited access

### User Management
- List all users (ADMIN only)
- Get current user profile
- Update and delete users (ADMIN only)

### Task Management
- Create, update, delete tasks
- Assign tasks to users
- Track task creator and assignee
- Filter by status and priority

### Dashboard & UX
- Role-aware dashboard (different UI for ADMIN and USER)
- Loading spinners and error banners
- Inline field validation error messages
- Search and filter tasks

---

## Screenshots

### Login Page
<img src="docs/screenshots/login.png" width="400"/>

### Dashboard
<img src="docs/screenshots/dashboard.png" width="700"/>

### Tasks Page
<img src="docs/screenshots/tasks.png" width="700"/>

### New Task Modal
<img src="docs/screenshots/new-task.png" width="350"/>

### Edit Task Modal
<img src="docs/screenshots/edit-task.png" width="350"/>

---

## Backend Setup (Local)

### Prerequisites
- Java 25
- Maven (or use Maven Wrapper)
- MySQL 8.0

### 1) Configure MySQL
```sql
CREATE DATABASE taskflowdb;
```

### 2) Run Backend
**Windows:**
```bash
cd backend
mvnw.cmd spring-boot:run
```
**Mac/Linux:**
```bash
cd backend
./mvnw spring-boot:run
```

Backend base URL:
```
http://localhost:8080/api
```

---

## Frontend Setup (Local)

### Prerequisites
- Node.js 22+

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend URL:
```
http://localhost:5173
```

---

## Run with Docker (Recommended)

### Prerequisites
- Docker Desktop

### Environment File
Copy `.env.example` to `.env` and fill in values:
```bash
cp .env.example .env
```

Current variables:
```env
MYSQL_ROOT_PASSWORD=taskflow123
MYSQL_DATABASE=taskflowdb
JWT_SECRET=your-jwt-secret-min-256-bits
```

### Start All Services
```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:80 |
| Backend | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui/index.html |

### Stop Services
```bash
docker compose down
```

### Stop and Remove DB Volume
```bash
docker compose down -v
```

---

## API Documentation

Swagger UI: `http://localhost:8080/swagger-ui/index.html`

Base URL: `http://localhost:8080/api`

### Auth APIs

**Register**
```
POST /api/auth/register
```
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login**
```
POST /api/auth/login
```
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Task APIs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/tasks | JWT | Get all tasks |
| POST | /api/tasks | JWT | Create task |
| PUT | /api/tasks/{id} | JWT | Update task |
| DELETE | /api/tasks/{id} | JWT | Delete task |
| GET | /api/tasks/status/{status} | JWT | Filter by status |

### User APIs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/users | Admin | Get all users |
| GET | /api/users/me | JWT | Get current user |
| GET | /api/users/{id} | Admin | Get user by ID |
| PUT | /api/users/{id} | Admin | Update user |
| DELETE | /api/users/{id} | Admin | Delete user |

### Error Format
```json
{
  "timestamp": "2026-03-27T10:00:00",
  "status": 400,
  "error": "Validation Failed",
  "fields": {
    "title": "must not be blank"
  }
}
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| SPRING_DATASOURCE_URL | localhost:3306 | MySQL connection URL |
| SPRING_DATASOURCE_USERNAME | root | DB username |
| SPRING_DATASOURCE_PASSWORD | taskflow123 | DB password |
| JWT_SECRET | (see .env) | JWT signing key |
| JWT_EXPIRATION | 86400000 | Token expiry in ms |

---

## CI/CD (GitHub Actions)

Workflow file: `.github/workflows/ci.yml`

Pipeline runs on every push and pull request to `main`:

- ✅ Backend Build & Test
- ✅ Frontend Build
- ✅ Docker Compose Build

---

## Default Users (Seeded)

| Email | Password | Role |
|---|---|---|
| admin@taskflow.com | admin123 | ADMIN |
| user@taskflow.com | user123 | USER |

---

## Security Notes
- Do not commit real secrets in source control
- Keep `.env` out of Git (already ignored at root)
- Use GitHub Secrets for CI/CD credentials

---

## Useful Commands

### Backend
```bash
cd backend
./mvnw clean verify
```

### Frontend
```bash
cd frontend
npm run build
```

### Docker
```bash
docker compose config
docker compose up --build
docker compose down
```

---

## Author

**Hemanth Abhinav**

---
