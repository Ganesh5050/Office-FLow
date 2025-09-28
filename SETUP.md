# OfficeFlow - Complete Setup Guide

## 🚀 Quick Start

This guide will help you set up the complete OfficeFlow Enterprise Management System with both frontend and backend.

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## 🛠️ Installation Steps

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env

# Edit .env file with your configuration:
# - Database credentials
# - JWT secret
# - Email settings (optional)
# - File upload settings

# Set up PostgreSQL database
createdb officeflow

# Run database migrations
npm run migrate

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

The backend will be available at `http://localhost:3001`

### 2. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies (if not already done)
npm install

# Set up environment variables
cp env.example .env

# Start frontend development server
npm run dev
```

The frontend will be available at `http://localhost:8080`

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=officeflow
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# CORS Configuration
FRONTEND_URL=http://localhost:8080
```

### Frontend Environment Variables (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=OfficeFlow
VITE_APP_VERSION=1.0.0
```

## 👥 Default User Accounts

After running the seed script, you can use these accounts:

- **Admin**: `admin@officeflow.com` / `admin123`
- **Manager**: `manager@officeflow.com` / `manager123`
- **User**: `user@officeflow.com` / `user123`

## 🗄️ Database Schema

The system includes the following main tables:

- **users** - User authentication and profiles
- **staff** - Staff directory information
- **products** - Product registration and tracking
- **facilities** - Facility information and availability
- **facility_bookings** - Booking records
- **documents** - Document storage and metadata
- **contact_messages** - Contact form submissions
- **gallery** - Image gallery

## 🔐 Authentication & Authorization

### User Roles

- **admin** - Full access to all features
- **manager** - Access to most features except user management
- **user** - Limited access to basic features

### Protected Routes

- `/admin` - Admin only
- User profile and settings - Authenticated users only

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Staff Management
- `GET /api/staff` - Get all staff members
- `POST /api/staff` - Create staff member (admin/manager)
- `PUT /api/staff/:id` - Update staff member (admin/manager)
- `DELETE /api/staff/:id` - Delete staff member (admin)

### Product Management
- `GET /api/products` - Get all products (admin/manager)
- `POST /api/products` - Register product (public)
- `GET /api/products/:id/status` - Get product status (public)
- `PUT /api/products/:id/status` - Update product status (admin/manager)

### Facility Management
- `GET /api/facilities` - Get all facilities
- `POST /api/facilities/book` - Book facility (authenticated)
- `GET /api/facilities/bookings/my` - Get user bookings

### Document Management
- `GET /api/documents` - Get all documents
- `POST /api/documents` - Upload documents (authenticated)
- `PUT /api/documents/:id` - Update document (admin/manager)

### Contact System
- `POST /api/contact` - Submit contact message (public)
- `GET /api/contact` - Get contact messages (admin/manager)

## 🚀 Deployment

### Production Setup

1. **Backend Deployment**
   ```bash
   # Set NODE_ENV=production
   # Use production PostgreSQL database
   # Set up proper SMTP configuration
   # Use reverse proxy (nginx)
   # Set up SSL certificates
   ```

2. **Frontend Deployment**
   ```bash
   # Build for production
   npm run build
   
   # Deploy to static hosting (Vercel, Netlify, etc.)
   # Or serve with nginx
   ```

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev  # Start with nodemon for auto-reload
```

### Frontend Development

```bash
npm run dev  # Start Vite development server
```

### Database Management

```bash
# Run migrations
cd backend
npm run migrate

# Seed database
npm run seed

# Reset database (if needed)
dropdb officeflow
createdb officeflow
npm run migrate
npm run seed
```

## 📁 Project Structure

```
officeflow/
├── backend/                 # Backend API
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── database/           # Database schema and connection
│   ├── scripts/            # Migration and seed scripts
│   └── server.js           # Main server file
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── services/           # API service layer
│   ├── contexts/           # React contexts
│   └── hooks/              # Custom hooks
├── public/                 # Static assets
└── package.json            # Frontend dependencies
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify database credentials in .env
   - Ensure database exists

2. **CORS Errors**
   - Check FRONTEND_URL in backend .env
   - Verify frontend is running on correct port

3. **File Upload Issues**
   - Check upload directory permissions
   - Verify MAX_FILE_SIZE setting
   - Ensure file types are allowed

4. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token expiration settings
   - Clear localStorage if needed

### Health Checks

- Backend: `http://localhost:3001/health`
- Frontend: `http://localhost:8080`

## 📞 Support

For issues and questions:
- Check the README files in backend/ and root directories
- Review the API documentation
- Check console logs for errors

## 🎉 You're Ready!

Once both servers are running:
1. Visit `http://localhost:8080`
2. Use the demo credentials to log in
3. Explore the features
4. Start customizing for your needs

The system is now fully functional with:
- ✅ User authentication and authorization
- ✅ Staff directory management
- ✅ Product registration and tracking
- ✅ Facility booking system
- ✅ Document management
- ✅ Contact form with email notifications
- ✅ Real-time updates
- ✅ File upload capabilities
- ✅ Responsive design
- ✅ Admin panel
