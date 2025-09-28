# OfficeFlow - Enterprise Management System

A comprehensive open-source enterprise management platform built with React, TypeScript, and Supabase.

## 🚀 Features

- **Staff Management**: Complete staff directory with profiles and contact information
- **Product Registration**: Streamlined product registration with real-time status tracking
- **Facility Booking**: Modern workspace facilities with premium amenities
- **Document Archives**: Secure document management with advanced search
- **Image Gallery**: Media gallery for workspace and team activities
- **Admin Dashboard**: Comprehensive analytics and management tools
- **Contact System**: Integrated contact form with email notifications

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, Supabase (PostgreSQL)
- **Authentication**: JWT with role-based access control
- **Deployment**: Vercel (Frontend), Supabase (Database)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Installation

```sh
# Clone the repository
git clone https://github.com/Ganesh5050/Office-FLow.git

# Navigate to project directory
cd Office-FLow

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `backend/database/supabase-schema.sql`
3. Seed the database with `backend/database/supabase-seed.sql`
4. Update environment variables in `backend/.env`

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect and deploy your React app
3. Your app will be available at `https://your-app.vercel.app`

### Manual Deployment

```sh
# Build for production
npm run build

# Deploy to your preferred hosting service
```

## 📱 Demo Accounts

- **Admin**: admin@officeflow.com / password123
- **Manager**: manager@officeflow.com / password123
- **User**: user@officeflow.com / password123

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- UI Components from [shadcn/ui](https://ui.shadcn.com/)
- Database powered by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)
