# 🚀 Quick Supabase Setup for OfficeFlow

## ⚡ 5-Minute Setup

### 1. Create Supabase Account (2 minutes)
1. Go to [supabase.com](https://supabase.com)
2. Sign up → Create new project
3. Choose region → Set database password
4. Wait for project to be ready

### 2. Get Credentials (1 minute)
1. Go to **Settings** → **API**
2. Copy **Project URL**: `https://xyz.supabase.co`
3. Copy **anon public key**: `eyJ...`

### 3. Configure Backend (1 minute)
1. Edit `backend/.env`:
   ```env
   USE_SUPABASE=true
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

### 4. Set Up Database (1 minute)
1. In Supabase dashboard → **SQL Editor**
2. Copy contents of `backend/database/supabase-schema.sql`
3. Paste and click **Run**
4. Copy contents of `backend/database/supabase-seed.sql`
5. Paste and click **Run**

### 5. Test (30 seconds)
```bash
cd backend
npm run dev
```

## ✅ What You Get

- **No local PostgreSQL needed**
- **Cloud-hosted database**
- **Built-in authentication**
- **Real-time updates**
- **File storage**
- **Free tier available**

## 🔑 Default Login

- **Admin**: `admin@officeflow.com` / `password123`
- **Manager**: `manager@officeflow.com` / `password123`
- **User**: `user@officeflow.com` / `password123`

## 🎯 Access URLs

- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:3001
- **Supabase Dashboard**: Your project dashboard

## 🚨 Troubleshooting

**Connection issues?**
- Check SUPABASE_URL and SUPABASE_ANON_KEY
- Ensure project is active in Supabase dashboard

**Database errors?**
- Run the SQL schema in Supabase SQL Editor
- Check if tables were created successfully

**Authentication problems?**
- Verify JWT_SECRET is set
- Check if users exist in Supabase dashboard

## 🎉 You're Done!

Your OfficeFlow system is now fully functional with Supabase! No local database installation required.
