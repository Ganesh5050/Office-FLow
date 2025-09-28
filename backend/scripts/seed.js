import { query } from '../database/connection.js';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminResult = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      ['admin@officeflow.com', adminPassword, 'Admin', 'User', 'admin']
    );

    let adminId = adminResult.rows[0]?.id;
    if (!adminId) {
      const existingAdmin = await query('SELECT id FROM users WHERE email = $1', ['admin@officeflow.com']);
      adminId = existingAdmin.rows[0].id;
    }

    // Create manager user
    const managerPassword = await bcrypt.hash('manager123', 12);
    const managerResult = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      ['manager@officeflow.com', managerPassword, 'Manager', 'User', 'manager']
    );

    let managerId = managerResult.rows[0]?.id;
    if (!managerId) {
      const existingManager = await query('SELECT id FROM users WHERE email = $1', ['manager@officeflow.com']);
      managerId = existingManager.rows[0].id;
    }

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const userResult = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      ['user@officeflow.com', userPassword, 'Regular', 'User', 'user']
    );

    let userId = userResult.rows[0]?.id;
    if (!userId) {
      const existingUser = await query('SELECT id FROM users WHERE email = $1', ['user@officeflow.com']);
      userId = existingUser.rows[0].id;
    }

    // Seed staff data
    const staffData = [
      {
        name: 'Sarah Johnson',
        role: 'Chief Executive Officer',
        department: 'Executive',
        email: 'sarah.johnson@officeflow.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        joinDate: '2019-01-15',
        bio: 'Leading OfficeFlow with 15+ years of experience in enterprise management and strategic development.',
        userId: adminId
      },
      {
        name: 'Michael Chen',
        role: 'Chief Technology Officer',
        department: 'Technology',
        email: 'michael.chen@officeflow.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        joinDate: '2020-03-22',
        bio: 'Driving technological innovation with expertise in software architecture and product development.',
        userId: managerId
      },
      {
        name: 'Emma Rodriguez',
        role: 'Head of Operations',
        department: 'Operations',
        email: 'emma.rodriguez@officeflow.com',
        phone: '+1 (555) 345-6789',
        location: 'Chicago, IL',
        joinDate: '2018-08-10',
        bio: 'Optimizing operational efficiency and ensuring seamless business processes across all departments.',
        userId: userId
      },
      {
        name: 'David Kim',
        role: 'Senior Product Manager',
        department: 'Product',
        email: 'david.kim@officeflow.com',
        phone: '+1 (555) 456-7890',
        location: 'Austin, TX',
        joinDate: '2021-06-01',
        bio: 'Focusing on product strategy and user experience to deliver exceptional solutions for our clients.',
        userId: userId
      },
      {
        name: 'Lisa Thompson',
        role: 'Business Analyst',
        department: 'Analytics',
        email: 'lisa.thompson@officeflow.com',
        phone: '+1 (555) 567-8901',
        location: 'Boston, MA',
        joinDate: '2022-02-14',
        bio: 'Analyzing business metrics and providing data-driven insights to support strategic decision making.',
        userId: userId
      }
    ];

    for (const staff of staffData) {
      await query(
        `INSERT INTO staff (name, role, department, email, phone, location, join_date, bio, user_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         ON CONFLICT (email) DO NOTHING`,
        [staff.name, staff.role, staff.department, staff.email, staff.phone, staff.location, staff.joinDate, staff.bio, staff.userId]
      );
    }

    // Seed facilities data
    const facilitiesData = [
      {
        name: 'Executive Conference Room',
        type: 'Conference Room',
        capacity: 12,
        availability: 'available',
        description: 'Premium conference room with state-of-the-art AV equipment, perfect for board meetings and client presentations.',
        amenities: ['4K Display', 'Video Conferencing', 'Whiteboard', 'Coffee Service', 'WiFi'],
        location: 'Floor 15, North Wing',
        pricePerHour: 150
      },
      {
        name: 'Open Collaboration Space',
        type: 'Work Space',
        capacity: 20,
        availability: 'occupied',
        description: 'Modern open workspace designed for team collaboration and creative brainstorming sessions.',
        amenities: ['Standing Desks', 'Writable Walls', 'WiFi', 'Phone Booths', 'Kitchenette'],
        location: 'Floor 8, Central Area',
        pricePerHour: 80
      },
      {
        name: 'Executive Lounge',
        type: 'Lounge',
        capacity: 8,
        availability: 'available',
        description: 'Sophisticated lounge area for informal meetings, client entertainment, and networking events.',
        amenities: ['Premium Seating', 'Bar Service', 'WiFi', 'Entertainment System', 'Catering'],
        location: 'Floor 20, Executive Level',
        pricePerHour: 200
      }
    ];

    for (const facility of facilitiesData) {
      await query(
        `INSERT INTO facilities (name, type, capacity, availability, description, amenities, location, price_per_hour) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         ON CONFLICT DO NOTHING`,
        [facility.name, facility.type, facility.capacity, facility.availability, facility.description, facility.amenities, facility.location, facility.pricePerHour]
      );
    }

    // Seed sample products
    const productsData = [
      {
        productName: 'Enterprise Software License',
        productId: 'PR-2024001',
        description: 'Comprehensive enterprise software solution for business management',
        userEmail: 'client1@example.com',
        status: 'approved',
        progress: 75,
        notes: 'License documentation approved. Preparing deployment package.',
        estimatedDelivery: '2024-02-15'
      },
      {
        productName: 'Office Equipment Bundle',
        productId: 'PR-2024002',
        description: 'Complete office equipment package including desks, chairs, and technology',
        userEmail: 'client2@example.com',
        status: 'in-production',
        progress: 60,
        notes: 'Manufacturing in progress. Quality checks scheduled for next week.',
        estimatedDelivery: '2024-02-01'
      },
      {
        productName: 'Custom Analytics Dashboard',
        productId: 'PR-2024003',
        description: 'Custom-built analytics dashboard for business intelligence',
        userEmail: 'client3@example.com',
        status: 'delivered',
        progress: 100,
        notes: 'Successfully delivered and deployed. Customer training completed.',
        estimatedDelivery: '2024-01-25'
      }
    ];

    for (const product of productsData) {
      await query(
        `INSERT INTO products (product_name, product_id, description, user_email, status, progress, notes, estimated_delivery) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         ON CONFLICT (product_id) DO NOTHING`,
        [product.productName, product.productId, product.description, product.userEmail, product.status, product.progress, product.notes, product.estimatedDelivery]
      );
    }

    // Seed sample contact messages
    const contactMessagesData = [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        subject: 'Inquiry about Enterprise Solutions',
        message: 'I am interested in learning more about your enterprise management solutions. Could you please provide more information about pricing and implementation?',
        status: 'new'
      },
      {
        name: 'Jane Doe',
        email: 'jane.doe@company.com',
        subject: 'Facility Booking Question',
        message: 'I would like to book the Executive Conference Room for next week. What are the available time slots?',
        status: 'read'
      },
      {
        name: 'Robert Johnson',
        email: 'robert.johnson@business.org',
        subject: 'Product Support Request',
        message: 'I am experiencing issues with my recently delivered analytics dashboard. Can someone help me troubleshoot?',
        status: 'replied'
      }
    ];

    for (const message of contactMessagesData) {
      await query(
        `INSERT INTO contact_messages (name, email, subject, message, status) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT DO NOTHING`,
        [message.name, message.email, message.subject, message.message, message.status]
      );
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Default Login Credentials:');
    console.log('Admin: admin@officeflow.com / admin123');
    console.log('Manager: manager@officeflow.com / manager123');
    console.log('User: user@officeflow.com / user123');
    console.log('\n🔗 API Endpoints:');
    console.log('Health Check: http://localhost:3001/health');
    console.log('API Base: http://localhost:3001/api');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData().then(() => {
    console.log('🎉 Seeding process completed!');
    process.exit(0);
  });
}

export default seedData;
