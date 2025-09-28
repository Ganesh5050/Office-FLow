# OfficeFlow Backend API

A comprehensive backend API for the OfficeFlow Enterprise Management System built with Node.js, Express, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization** - JWT-based auth with role-based access control
- **Staff Management** - Complete staff directory with profiles and contact information
- **Product Registration** - Product registration and status tracking system
- **Facility Booking** - Facility management and booking system
- **Document Management** - File upload and document archive system
- **Contact System** - Contact form with email notifications
- **Real-time Updates** - Socket.io for real-time notifications
- **File Upload** - Secure file upload with validation
- **Email Integration** - Automated email notifications
- **Database** - PostgreSQL with comprehensive schema

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
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

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb officeflow
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE officeflow;
   \q
   ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Seed the database with sample data**
   ```bash
   npm run seed
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Staff Management Endpoints

#### Get All Staff
```http
GET /api/staff?page=1&limit=20&department=Technology&search=john
```

#### Get Single Staff Member
```http
GET /api/staff/:id
```

#### Create Staff Member (Admin/Manager)
```http
POST /api/staff
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "John Doe",
  "role": "Software Engineer",
  "department": "Technology",
  "email": "john.doe@company.com",
  "phone": "+1-555-0123",
  "location": "New York, NY",
  "joinDate": "2024-01-15",
  "bio": "Experienced software engineer...",
  "image": <file>
}
```

### Product Management Endpoints

#### Register Product (Public)
```http
POST /api/products
Content-Type: multipart/form-data

{
  "productName": "Enterprise Software",
  "productId": "PR-2024001",
  "description": "Software description...",
  "email": "client@example.com",
  "documents": <file>
}
```

#### Get Product Status (Public)
```http
GET /api/products/:id/status
```

#### Update Product Status (Admin/Manager)
```http
PUT /api/products/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "progress": 75,
  "notes": "Status update notes...",
  "estimatedDelivery": "2024-02-15"
}
```

### Facility Management Endpoints

#### Get All Facilities
```http
GET /api/facilities?page=1&limit=20&type=Conference Room&availability=available
```

#### Book Facility
```http
POST /api/facilities/book
Authorization: Bearer <token>
Content-Type: application/json

{
  "facilityId": "uuid",
  "bookingDate": "2024-02-15",
  "startTime": "09:00",
  "endTime": "11:00",
  "notes": "Team meeting"
}
```

#### Get User Bookings
```http
GET /api/facilities/bookings/my
Authorization: Bearer <token>
```

### Document Management Endpoints

#### Get All Documents
```http
GET /api/documents?page=1&limit=20&category=Policy&search=document
```

#### Upload Documents
```http
POST /api/documents
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Document Title",
  "description": "Document description...",
  "category": "Policy",
  "tags": ["tag1", "tag2"],
  "isPublic": true,
  "files": <files>
}
```

### Contact Endpoints

#### Submit Contact Message (Public)
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "Message content..."
}
```

#### Get Contact Messages (Admin/Manager)
```http
GET /api/contact?page=1&limit=20&status=new
Authorization: Bearer <token>
```

## 🔐 Authentication & Authorization

### User Roles
- **admin** - Full access to all features
- **manager** - Access to most features except user management
- **user** - Limited access to basic features

### JWT Token
Include the JWT token in the Authorization header:
```http
Authorization: Bearer <your-jwt-token>
```

## 📁 File Upload

The API supports file uploads for:
- Staff profile images
- Product documents
- Document archives
- Gallery images

### Supported File Types
- Images: JPEG, PNG, GIF, WebP
- Documents: PDF, DOC, DOCX, XLS, XLSX, TXT, CSV

### File Size Limit
- Maximum file size: 10MB
- Maximum files per request: 5

## 🗄️ Database Schema

### Core Tables
- **users** - User authentication and profiles
- **staff** - Staff directory information
- **products** - Product registration and tracking
- **facilities** - Facility information and availability
- **facility_bookings** - Booking records
- **documents** - Document storage and metadata
- **contact_messages** - Contact form submissions
- **gallery** - Image gallery

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT expiration time
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `MAX_FILE_SIZE` - Maximum file upload size
- `FRONTEND_URL` - Frontend URL for CORS

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Use a production PostgreSQL database
3. Set up proper SMTP configuration
4. Use a reverse proxy (nginx)
5. Set up SSL certificates
6. Configure proper logging

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🧪 Testing

### Health Check
```http
GET /health
```

### Sample Data
The seed script creates sample data including:
- Admin user: `admin@officeflow.com` / `admin123`
- Manager user: `manager@officeflow.com` / `manager123`
- Regular user: `user@officeflow.com` / `user123`
- Sample staff members
- Sample facilities
- Sample products
- Sample contact messages

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

## 🔒 Security Features

- JWT-based authentication
- Role-based authorization
- Input validation with Joi
- SQL injection prevention
- File upload validation
- Rate limiting
- CORS configuration
- Helmet security headers

## 📞 Support

For support and questions:
- Email: support@officeflow.com
- Documentation: [API Docs](http://localhost:3001/api-docs)
- Issues: [GitHub Issues](https://github.com/officeflow/issues)

## 📄 License

This project is licensed under the MIT License.
