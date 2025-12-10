# Quick Start Commands

## Development (Local)

```bash
# 1. Start PostgreSQL and Redis (Docker)
docker run --name truvamate-postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:16
docker run --name truvamate-redis -p 6379:6379 -d redis:7-alpine

# 2. Create database
docker exec -it truvamate-postgres psql -U postgres -c "CREATE DATABASE truvamate_db;"

# 3. Setup environment
cd backend
cp .env.example .env
# Edit .env with your credentials

# 4. Install and run
npm install
npm run dev
```

## Development (Docker Compose)

```bash
cd backend
docker-compose up -d
```

## Production

```bash
cd backend
npm run build
npm start
```

## Test API

```bash
# Health check
curl http://localhost:5000/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User","dateOfBirth":"1995-01-01"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
