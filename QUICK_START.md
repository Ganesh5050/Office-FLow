# 🚀 OfficeFlow Quick Start Guide

## ⚠️ IMPORTANT: What You Need to Install

### 1. **PostgreSQL Database** (REQUIRED)
The application requires PostgreSQL to run. You need to install it first:

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Install with default settings
- Remember the password you set for the 'postgres' user
- Default port: 5432

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. **Create Database**
After installing PostgreSQL, create the database:

```bash
# Windows (if psql is in PATH)
psql -U postgres
CREATE DATABASE officeflow;
\q

# Or use pgAdmin (GUI tool that comes with PostgreSQL)
```

## 🛠️ Setup Steps

### Step 1: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
copy env.example .env

# Edit .env file with your PostgreSQL password:
# DB_PASSWORD=your_postgres_password

# Create database (if not done above)
createdb officeflow

# Run database setup
npm run migrate
npm run seed

# Start backend
npm run dev
```

### Step 2: Frontend Setup
```bash
# Go back to root directory
cd ..

# Install dependencies (already done)
npm install

# Create environment file
copy env.example .env

# Start frontend
npm run dev
```

## 🔑 Default Login Credentials

After running the seed script, use these accounts:

- **Admin**: `admin@officeflow.com` / `admin123`
- **Manager**: `manager@officeflow.com` / `manager123`
- **User**: `user@officeflow.com` / `user123`

## 🌐 Access URLs

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🐛 Troubleshooting

### Database Connection Issues
1. Make sure PostgreSQL is running
2. Check your password in `backend/.env`
3. Verify database exists: `psql -U postgres -l`

### Port Already in Use
- Backend (3001): Change `PORT` in `backend/.env`
- Frontend (8080): Change port in `vite.config.ts`

### CORS Errors
- Check `FRONTEND_URL` in `backend/.env` matches your frontend URL

## 📁 File Structure
```
officeflow/
├── backend/          # Node.js API server
├── src/             # React frontend
├── public/          # Static assets
└── package.json     # Frontend dependencies
```

## ✅ What's Working

- ✅ User authentication (login/register)
- ✅ Staff directory management
- ✅ Product registration and tracking
- ✅ Facility booking system
- ✅ Document management
- ✅ Contact form
- ✅ Admin panel
- ✅ File uploads
- ✅ Real-time updates
- ✅ Responsive design

## 🎯 Next Steps

1. Install PostgreSQL
2. Follow setup steps above
3. Access the application
4. Start customizing for your needs

The system is production-ready with proper security, validation, and error handling!
