# 🚀 Supabase Setup Guide for OfficeFlow

## ✅ Why Use Supabase?

- **No local installation required** - Cloud-hosted PostgreSQL
- **Built-in authentication** - User management out of the box
- **Real-time subscriptions** - Live data updates
- **File storage** - Built-in file upload system
- **Dashboard** - Easy database management
- **Free tier** - Perfect for development and small projects

## 🛠️ Setup Steps

### 1. Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
4. Choose a region close to you
5. Set a strong database password

### 2. Get Your Credentials

In your Supabase dashboard:

1. Go to **Settings** → **API**
2. Copy your **Project URL** (looks like: `https://xyz.supabase.co`)
3. Copy your **anon public** key (starts with `eyJ...`)

### 3. Configure Backend

1. **Update environment file:**
   ```bash
   cd backend
   # Edit .env file
   ```

2. **Add Supabase credentials:**
   ```env
   USE_SUPABASE=true
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

### 4. Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `backend/database/supabase-schema.sql`
3. Click **Run** to create all tables

### 5. Add Sample Data

1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `backend/database/supabase-seed.sql`
3. Click **Run** to add sample data

### 6. Configure Row Level Security (RLS)

The schema includes RLS policies, but you may need to adjust them:

1. Go to **Authentication** → **Policies**
2. Review and adjust policies as needed
3. For development, you can temporarily disable RLS if needed

### 7. Test the Connection

1. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Check the logs** - you should see:
   ```
   🔗 Using Supabase database
   🚀 Server running on port 3001
   ```

3. **Test the API:**
   ```bash
   curl http://localhost:3001/health
   ```

## 🔧 Configuration Details

### Environment Variables

```env
# Supabase Configuration
USE_SUPABASE=true
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Configuration (for your app's authentication)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Other settings
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

### Database Tables Created

- ✅ **users** - User authentication and profiles
- ✅ **staff** - Staff directory information
- ✅ **products** - Product registration and tracking
- ✅ **facilities** - Facility information and availability
- ✅ **facility_bookings** - Booking records
- ✅ **documents** - Document storage and metadata
- ✅ **contact_messages** - Contact form submissions
- ✅ **gallery** - Image gallery

### Sample Data Included

- ✅ **3 users**: admin, manager, user
- ✅ **5 staff members** with profiles
- ✅ **3 facilities** for booking
- ✅ **3 products** with different statuses
- ✅ **3 contact messages** with various statuses
- ✅ **3 gallery items** with images

## 🔐 Authentication

### Default Login Credentials

After running the seed script:

- **Admin**: `admin@officeflow.com` / `password123`
- **Manager**: `manager@officeflow.com` / `password123`
- **User**: `user@officeflow.com` / `password123`

### Password Security

⚠️ **Important**: Change these passwords in production!

The seed script uses a simple password hash. For production:

1. Use strong, unique passwords
2. Consider using Supabase's built-in authentication
3. Implement proper password policies

## 🚀 Advanced Features

### Real-time Subscriptions

Supabase supports real-time updates. You can enable this for:

- Live staff directory updates
- Real-time product status changes
- Live facility booking updates
- Instant contact message notifications

### File Storage

Supabase includes built-in file storage:

- Profile images
- Document uploads
- Gallery images
- Product documents

### Built-in Authentication

You can use Supabase's authentication instead of custom JWT:

- Email/password authentication
- Social login (Google, GitHub, etc.)
- Magic link authentication
- Phone number authentication

## 🐛 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check your SUPABASE_URL and SUPABASE_ANON_KEY
   - Ensure your project is active in Supabase dashboard

2. **Permission Denied**
   - Check RLS policies in Supabase
   - Verify your anon key has correct permissions

3. **Table Not Found**
   - Run the schema SQL in Supabase SQL Editor
   - Check if tables were created successfully

4. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check if users exist in the database

### Debug Steps

1. **Check Supabase Dashboard**
   - Go to **Table Editor** to see if tables exist
   - Check **Authentication** → **Users** for user accounts
   - Review **Logs** for any errors

2. **Test Database Connection**
   ```bash
   # Test in Supabase SQL Editor
   SELECT * FROM users LIMIT 1;
   ```

3. **Check Backend Logs**
   ```bash
   cd backend
   npm run dev
   # Look for connection messages
   ```

## 📊 Monitoring

### Supabase Dashboard

- **Database**: Monitor queries and performance
- **Authentication**: Track user signups and logins
- **Storage**: Monitor file uploads and usage
- **Logs**: View real-time logs and errors

### Metrics to Watch

- **API calls per minute**
- **Database query performance**
- **Storage usage**
- **Authentication events**

## 🎯 Next Steps

### Development

1. **Customize the schema** for your needs
2. **Add more sample data** for testing
3. **Implement real-time features** using Supabase subscriptions
4. **Add file upload functionality** using Supabase storage

### Production

1. **Set up proper RLS policies** for security
2. **Configure backup and monitoring**
3. **Set up proper authentication** (consider Supabase Auth)
4. **Monitor usage and costs**

## 💡 Tips

### Performance

- Use **indexes** for frequently queried columns
- Implement **pagination** for large datasets
- Use **selective queries** to reduce data transfer

### Security

- **Enable RLS** on all tables
- **Use service role key** for admin operations
- **Validate all inputs** on both client and server
- **Implement rate limiting** for API endpoints

### Cost Optimization

- **Monitor usage** in Supabase dashboard
- **Use efficient queries** to reduce database load
- **Implement caching** where appropriate
- **Clean up old data** regularly

## 🎉 You're Ready!

Once you've completed these steps:

1. ✅ **Supabase project created**
2. ✅ **Database schema deployed**
3. ✅ **Sample data loaded**
4. ✅ **Backend configured**
5. ✅ **API endpoints working**

Your OfficeFlow system is now fully functional with Supabase! 🚀

## 📞 Support

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Community**: [github.com/supabase/supabase](https://github.com/supabase/supabase)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)
