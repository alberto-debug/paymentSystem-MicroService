# Payflow

Payflow is a distributed digital wallet and payment orchestration platform. The system implements user identity management via Keycloak (OAuth2 / OpenID Connect), distributed sessions using Redis, transactional persistence with PostgreSQL and Flyway, and a client-facing web application built with React and Vite.

---

## Architecture Overview

| Service | Technology | Port | Description |
| :--- | :--- | :--- | :--- |
| `frontend` | React 19, Vite, Nginx | `3000` | Client web interface (SPA) |
| `payment-system-app` | Spring Boot, Java 21 | `8080` | REST API, wallet domain logic, and BFF layer |
| `keycloak` | Keycloak 24 (Quarkus) | `8081` | Identity and Access Management (OAuth2 / OIDC) |
| `payflow-db` | PostgreSQL 15 | `5432` | Relational database (application data and Keycloak) |
| `payflow-redis` | Redis 7 | `6379` | Distributed session storage and caching |

---

## Prerequisites

- Docker Engine 24+ and Docker Compose v2
- Java Development Kit (JDK) 21 (for local backend development)
- Node.js 20+ and npm (for local frontend development)

---

## Local Development

For active development, run only the supporting infrastructure inside Docker containers while executing the backend and frontend on the host machine to enable debugging and hot reloading.

### 1. Start Supporting Services

```bash
docker compose up -d payflow-db keycloak payflow-redis
```

Verify service availability:

```bash
docker compose ps
```

- Keycloak Admin Console: `http://localhost:8081`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

### 2. Run the Backend API

```bash
./mvnw spring-boot:run
```

The Spring Boot application automatically executes Flyway schema migrations on startup and initializes the connection pool against the local PostgreSQL container.

### 3. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will be accessible at `http://localhost:3000`.

---

## Production Deployment Workflow

Production workloads run as containerized services managed by Docker Compose on an AWS EC2 instance. Application artifacts are distributed via Docker Hub images built with multi-stage Dockerfiles.

### 1. Build and Publish Images

#### Backend API:

```bash
docker build --platform linux/amd64 -t <dockerhub-username>/payflow-app:<tag> .
docker push <dockerhub-username>/payflow-app:<tag>
```

#### Frontend Web Application:

```bash
docker build --platform linux/amd64 -t <dockerhub-username>/payflow-frontend:<tag> ./frontend
docker push <dockerhub-username>/payflow-frontend:<tag>
```

---

### 2. Server Deployment

On the remote host (`~/app`):

#### Initial Setup

Ensure configuration directories and files are present on the host:

```bash
scp -r docker-compose.yml postgres-init keycloak ubuntu@<server-ip>:~/app/
```

Create and secure the environment configuration:

```bash
nano .env
chmod 600 .env
```

#### Environment Variables Reference (`.env`)

```dotenv
# Image Tags
PAYFLOW_APP_IMAGE=<dockerhub-username>/payflow-app:v1
PAYFLOW_FRONTEND_IMAGE=<dockerhub-username>/payflow-frontend:v1

# PostgreSQL
POSTGRES_DB=payflow_db
POSTGRES_USER=payflowAdmin
POSTGRES_PASSWORD=<strong-database-password>

# Keycloak Administration
KEYCLOAK_ADMIN_USER=admin
KEYCLOAK_ADMIN_PASSWORD=<strong-admin-password>

# OAuth2 Client Credentials
PAYFLOW_BFF_CLIENT_SECRET=E1bdIx6iyWOLANmD6l6X96Ql5mFQiNWc
PAYFLOW_API_CLIENT_ID=payflow-api
PAYFLOW_API_CLIENT_SECRET=<client-secret>
```

#### Pull and Run

```bash
docker compose pull
docker compose up -d
```

---

### 3. Continuous Delivery & Service Updates

To deploy an update without restarting unaffected infrastructure (e.g. updating the backend without touching Keycloak or PostgreSQL):

#### Updating the Backend:

1. Update `PAYFLOW_APP_IMAGE` in `.env` to the new tag (e.g., `:v2`).
2. Pull the image and recreate the container:
   ```bash
   docker compose pull payment-system-app
   docker compose up -d payment-system-app
   ```

#### Updating the Frontend:

1. Update `PAYFLOW_FRONTEND_IMAGE` in `.env` to the new tag (e.g., `:v2`).
2. Pull the image and recreate the container:
   ```bash
   docker compose pull frontend
   docker compose up -d frontend
   ```

---

## Rollback Procedure

To roll back a faulty deployment:

1. Edit `.env` and revert the image tag to the last known stable version:
   ```dotenv
   PAYFLOW_APP_IMAGE=<dockerhub-username>/payflow-app:<stable-tag>
   ```
2. Re-apply the target container:
   ```bash
   docker compose up -d payment-system-app
   ```

The container will be recreated with the previous image version in seconds.

---

## Operations & Maintenance

```bash
# Check container status
docker compose ps

# Follow live container logs
docker compose logs -f payment-system-app
docker compose logs -f frontend
docker compose logs -f keycloak

# Real-time resource usage (CPU / Memory)
docker stats

# Clean up untagged images and build cache
docker system prune -f
```
