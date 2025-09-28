-- Supabase Seed Data for OfficeFlow
-- Run these commands in your Supabase SQL Editor after creating the schema

-- Insert sample users
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@officeflow.com', '$2a$12$QM2EuzIqmTX56D63db0yyupjwsPgkRGgfkgMZUjIqTECVinUfRnHe', 'Admin', 'User', 'admin'),
('manager@officeflow.com', '$2a$12$QM2EuzIqmTX56D63db0yyupjwsPgkRGgfkgMZUjIqTECVinUfRnHe', 'Manager', 'User', 'manager'),
('user@officeflow.com', '$2a$12$QM2EuzIqmTX56D63db0yyupjwsPgkRGgfkgMZUjIqTECVinUfRnHe', 'Regular', 'User', 'user');

-- Get user IDs for foreign key references
-- Note: In Supabase, you'll need to get these IDs from the users table after insertion

-- Insert sample staff members
INSERT INTO staff (name, role, department, email, phone, location, join_date, bio, user_id) VALUES
('Sarah Johnson', 'Chief Executive Officer', 'Executive', 'sarah.johnson@officeflow.com', '+1 (555) 123-4567', 'New York, NY', '2019-01-15', 'Leading OfficeFlow with 15+ years of experience in enterprise management and strategic development.', (SELECT id FROM users WHERE email = 'admin@officeflow.com')),
('Michael Chen', 'Chief Technology Officer', 'Technology', 'michael.chen@officeflow.com', '+1 (555) 234-5678', 'San Francisco, CA', '2020-03-22', 'Driving technological innovation with expertise in software architecture and product development.', (SELECT id FROM users WHERE email = 'manager@officeflow.com')),
('Emma Rodriguez', 'Head of Operations', 'Operations', 'emma.rodriguez@officeflow.com', '+1 (555) 345-6789', 'Chicago, IL', '2018-08-10', 'Optimizing operational efficiency and ensuring seamless business processes across all departments.', (SELECT id FROM users WHERE email = 'user@officeflow.com')),
('David Kim', 'Senior Product Manager', 'Product', 'david.kim@officeflow.com', '+1 (555) 456-7890', 'Austin, TX', '2021-06-01', 'Focusing on product strategy and user experience to deliver exceptional solutions for our clients.', (SELECT id FROM users WHERE email = 'user@officeflow.com')),
('Lisa Thompson', 'Business Analyst', 'Analytics', 'lisa.thompson@officeflow.com', '+1 (555) 567-8901', 'Boston, MA', '2022-02-14', 'Analyzing business metrics and providing data-driven insights to support strategic decision making.', (SELECT id FROM users WHERE email = 'user@officeflow.com'));

-- Insert sample facilities
INSERT INTO facilities (name, type, capacity, availability, description, amenities, location, price_per_hour) VALUES
('Executive Conference Room', 'Conference Room', 12, 'available', 'Premium conference room with state-of-the-art AV equipment, perfect for board meetings and client presentations.', ARRAY['4K Display', 'Video Conferencing', 'Whiteboard', 'Coffee Service', 'WiFi'], 'Floor 15, North Wing', 150.00),
('Open Collaboration Space', 'Work Space', 20, 'occupied', 'Modern open workspace designed for team collaboration and creative brainstorming sessions.', ARRAY['Standing Desks', 'Writable Walls', 'WiFi', 'Phone Booths', 'Kitchenette'], 'Floor 8, Central Area', 80.00),
('Executive Lounge', 'Lounge', 8, 'available', 'Sophisticated lounge area for informal meetings, client entertainment, and networking events.', ARRAY['Premium Seating', 'Bar Service', 'WiFi', 'Entertainment System', 'Catering'], 'Floor 20, Executive Level', 200.00);

-- Insert sample products
INSERT INTO products (product_name, product_id, description, user_email, status, progress, notes, estimated_delivery) VALUES
('Enterprise Software License', 'PR-2024001', 'Comprehensive enterprise software solution for business management', 'client1@example.com', 'approved', 75, 'License documentation approved. Preparing deployment package.', '2024-02-15'),
('Office Equipment Bundle', 'PR-2024002', 'Complete office equipment package including desks, chairs, and technology', 'client2@example.com', 'in-production', 60, 'Manufacturing in progress. Quality checks scheduled for next week.', '2024-02-01'),
('Custom Analytics Dashboard', 'PR-2024003', 'Custom-built analytics dashboard for business intelligence', 'client3@example.com', 'delivered', 100, 'Successfully delivered and deployed. Customer training completed.', '2024-01-25');

-- Insert sample contact messages
INSERT INTO contact_messages (name, email, subject, message, status) VALUES
('John Smith', 'john.smith@example.com', 'Inquiry about Enterprise Solutions', 'I am interested in learning more about your enterprise management solutions. Could you please provide more information about pricing and implementation?', 'new'),
('Jane Doe', 'jane.doe@company.com', 'Facility Booking Question', 'I would like to book the Executive Conference Room for next week. What are the available time slots?', 'read'),
('Robert Johnson', 'robert.johnson@business.org', 'Product Support Request', 'I am experiencing issues with my recently delivered analytics dashboard. Can someone help me troubleshoot?', 'replied');

-- Insert sample gallery items
INSERT INTO gallery (title, description, image_url, category, tags, uploaded_by, is_featured) VALUES
('Office Building Exterior', 'Modern office building with glass facade', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'Architecture', ARRAY['office', 'building', 'modern'], (SELECT id FROM users WHERE email = 'admin@officeflow.com'), true),
('Conference Room Setup', 'Professional conference room with modern amenities', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'Interior', ARRAY['conference', 'meeting', 'professional'], (SELECT id FROM users WHERE email = 'manager@officeflow.com'), true),
('Team Collaboration Space', 'Open workspace designed for team collaboration', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800', 'Interior', ARRAY['collaboration', 'team', 'workspace'], (SELECT id FROM users WHERE email = 'user@officeflow.com'), false);

-- Note: The password hash above is for 'password123' - you should change this in production
-- To generate a new hash, use: bcrypt.hash('your_password', 12)
