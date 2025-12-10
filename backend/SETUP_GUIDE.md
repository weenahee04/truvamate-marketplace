# 🚀 Backend Setup Guide - Step by Step

## ขั้นตอนที่ 1: ติดตั้ง PostgreSQL

### Windows:
```bash
# Download จาก https://www.postgresql.org/download/windows/
# หรือใช้ Chocolatey:
choco install postgresql

# หรือใช้ Docker (แนะนำ):
docker run --name truvamate-postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:16
```

### สร้าง Database:
```bash
# เข้า PostgreSQL shell
psql -U postgres

# สร้าง database
CREATE DATABASE truvamate_db;

# สร้าง user (optional)
CREATE USER truvamate WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE truvamate_db TO truvamate;

# ออกจาก shell
\q
```

---

## ขั้นตอนที่ 2: ติดตั้ง Redis

### Windows:
```bash
# ใช้ Docker (แนะนำ):
docker run --name truvamate-redis -p 6379:6379 -d redis:7-alpine

# หรือ download จาก https://github.com/microsoftarchive/redis/releases
```

### ทดสอบ Redis:
```bash
docker exec -it truvamate-redis redis-cli
ping
# ควรได้ PONG
```

---

## ขั้นตอนที่ 3: ตั้งค่า Environment Variables

```bash
cd backend
cp .env.example .env
```

แก้ไขไฟล์ `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_DATABASE=truvamate_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secret (สร้าง random string)
JWT_SECRET=your_super_secret_key_minimum_32_characters_long_here
JWT_REFRESH_SECRET=your_refresh_secret_also_very_long_string

# Stripe (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid (Get from https://sendgrid.com/)
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=Truvamate

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## ขั้นตอนที่ 4: รัน Backend

```bash
cd backend

# Development mode (auto-reload)
npm run dev

# Production build
npm run build
npm start
```

### ตรวจสอบว่าทำงาน:
เปิด browser ไปที่: http://localhost:5000/health

ควรเห็น:
```json
{
  "status": "ok",
  "timestamp": "2025-12-10T...",
  "environment": "development"
}
```

---

## ขั้นตอนที่ 5: ทดสอบ API

### ใช้ curl:
```bash
# Test health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "dateOfBirth": "1995-01-01"
  }'

# Get jackpots
curl http://localhost:5000/api/lotto/jackpots
```

### ใช้ Thunder Client / Postman:
1. Import collection จาก `backend/postman_collection.json` (ถ้ามี)
2. Test endpoints ตามลำดับ

---

## ขั้นตอนที่ 6: เชื่อม Frontend

แก้ไขไฟล์ `frontend/.env` หรือ `frontend/vite.config.ts`:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

หรือสร้างไฟล์ `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

แก้ไข API calls ใน frontend:
```typescript
// Before (mock)
const response = await fetch('/api/lotto/jackpots');

// After (real API)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const response = await fetch(`${API_URL}/api/lotto/jackpots`);
```

---

## 🐳 Docker Setup (Alternative - แนะนำสำหรับ Production)

สร้างไฟล์ `backend/docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: truvamate-postgres
    environment:
      POSTGRES_DB: truvamate_db
      POSTGRES_USER: truvamate
      POSTGRES_PASSWORD: yourpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: truvamate-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: .
    container_name: truvamate-backend
    depends_on:
      - postgres
      - redis
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: truvamate
      DB_PASSWORD: yourpassword
      DB_DATABASE: truvamate_db
      REDIS_HOST: redis
      REDIS_PORT: 6379
    ports:
      - "5000:5000"
    volumes:
      - ./src:/app/src
      - ./logs:/app/logs
    command: npm run dev

volumes:
  postgres_data:
  redis_data:
```

รัน Docker:
```bash
cd backend
docker-compose up -d
```

---

## 📋 Checklist การติดตั้ง

- [ ] ติดตั้ง PostgreSQL แล้ว
- [ ] สร้าง database `truvamate_db` แล้ว
- [ ] ติดตั้ง Redis แล้ว
- [ ] ตั้งค่า `.env` แล้ว (ใส่ค่าจริงทั้งหมด)
- [ ] รัน `npm install` สำเร็จ
- [ ] รัน `npm run dev` ได้
- [ ] เข้า http://localhost:5000/health ได้
- [ ] Test register API สำเร็จ
- [ ] Test login API สำเร็จ
- [ ] Frontend เชื่อมต่อ backend ได้

---

## 🔧 Troubleshooting

### ปัญหา: Database connection failed
```
✅ แก้ไข: ตรวจสอบ DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD ใน .env
✅ ตรวจสอบว่า PostgreSQL ทำงานอยู่: pg_isready
✅ ตรวจสอบ firewall: telnet localhost 5432
```

### ปัญหา: Redis connection error
```
✅ แก้ไข: ตรวจสอบว่า Redis ทำงานอยู่
Windows: docker ps | findstr redis
✅ ทดสอบ: redis-cli ping
```

### ปัญหา: JWT secret error
```
✅ แก้ไข: ตรวจสอบว่า JWT_SECRET มีความยาวอย่างน้อย 32 characters
✅ สร้าง secret ใหม่: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ปัญหา: Port 5000 already in use
```
✅ แก้ไข: เปลี่ยน PORT ใน .env
✅ หรือ kill process: 
Windows: netstat -ano | findstr :5000
taskkill /F /PID <PID>
```

### ปัญหา: TypeORM synchronize error
```
✅ แก้ไข: ลบ database และสร้างใหม่
DROP DATABASE truvamate_db;
CREATE DATABASE truvamate_db;
```

---

## 📊 Database Tables (Auto-created)

เมื่อรัน backend ครั้งแรก TypeORM จะสร้าง tables ให้อัตโนมัติ:

- ✅ users
- ✅ lotto_orders
- ✅ lotto_tickets
- ✅ draw_results
- ✅ marketplace_orders
- ✅ order_items
- ✅ payments

ตรวจสอบ tables:
```bash
psql -U postgres truvamate_db
\dt
```

---

## 🎯 Next Steps

1. **ทดสอบ API ทั้งหมด**
   - Authentication
   - Lotto orders
   - Payments

2. **เชื่อม Frontend**
   - Replace mock data with real API calls
   - Add axios/fetch interceptors
   - Handle authentication tokens

3. **Setup Email**
   - Get SendGrid API key
   - Test email sending
   - Create email templates

4. **Setup Payment**
   - Get Stripe test keys
   - Test payment flow
   - Setup webhooks

5. **Deploy to Production**
   - Railway.app, Render.com, or DigitalOcean
   - Setup production database
   - Configure environment variables

---

## 📞 Need Help?

- Documentation: `backend/README.md`
- System Review: `SYSTEM_REVIEW_AND_BACKEND_PLAN.md`
- API Endpoints: Check `backend/src/routes/`

---

**สำเร็จ! Backend พร้อมใช้งาน 🎉**
