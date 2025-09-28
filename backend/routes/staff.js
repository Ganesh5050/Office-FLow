import express from 'express';
import { query } from '../database/connection.js';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth.js';
import { uploadSingle, getFileUrl } from '../middleware/upload.js';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const staffSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  role: Joi.string().min(2).max(255).required(),
  department: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().max(20).allow(''),
  location: Joi.string().max(255).allow(''),
  joinDate: Joi.date().required(),
  bio: Joi.string().max(1000).allow('')
});

// Get all staff members (public endpoint)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, department, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE s.is_active = true';
    const queryParams = [];
    let paramCount = 1;

    if (department && department !== 'All') {
      whereClause += ` AND s.department = $${paramCount++}`;
      queryParams.push(department);
    }

    if (search) {
      whereClause += ` AND (s.name ILIKE $${paramCount++} OR s.role ILIKE $${paramCount++})`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM staff s ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get staff members
    const result = await query(
      `SELECT s.id, s.name, s.role, s.department, s.email, s.phone, s.location, 
              s.join_date, s.bio, s.image_url, s.created_at, s.updated_at
       FROM staff s 
       ${whereClause}
       ORDER BY s.name ASC
       LIMIT $${paramCount++} OFFSET $${paramCount++}`,
      [...queryParams, limit, offset]
    );

    const staff = result.rows.map(member => ({
      id: member.id,
      name: member.name,
      role: member.role,
      department: member.department,
      email: member.email,
      phone: member.phone,
      location: member.location,
      joinDate: member.join_date,
      bio: member.bio,
      image: member.image_url,
      createdAt: member.created_at,
      updatedAt: member.updated_at
    }));

    res.json({
      success: true,
      data: {
        staff,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single staff member
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT s.id, s.name, s.role, s.department, s.email, s.phone, s.location, 
              s.join_date, s.bio, s.image_url, s.created_at, s.updated_at
       FROM staff s 
       WHERE s.id = $1 AND s.is_active = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    const member = result.rows[0];

    res.json({
      success: true,
      data: {
        staff: {
          id: member.id,
          name: member.name,
          role: member.role,
          department: member.department,
          email: member.email,
          phone: member.phone,
          location: member.location,
          joinDate: member.join_date,
          bio: member.bio,
          image: member.image_url,
          createdAt: member.created_at,
          updatedAt: member.updated_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create new staff member (admin/manager only)
router.post('/', authenticateToken, requireRole(['admin', 'manager']), uploadSingle('image'), async (req, res, next) => {
  try {
    const { error, value } = staffSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, role, department, email, phone, location, joinDate, bio } = value;

    // Check if email already exists
    const existingStaff = await query(
      'SELECT id FROM staff WHERE email = $1',
      [email]
    );

    if (existingStaff.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Staff member with this email already exists'
      });
    }

    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      imageUrl = getFileUrl(req, req.file.path);
    }

    // Create staff member
    const result = await query(
      `INSERT INTO staff (name, role, department, email, phone, location, join_date, bio, image_url, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING id, name, role, department, email, phone, location, join_date, bio, image_url, created_at`,
      [name, role, department, email, phone, location, joinDate, bio, imageUrl, req.user.id]
    );

    const newStaff = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: {
        staff: {
          id: newStaff.id,
          name: newStaff.name,
          role: newStaff.role,
          department: newStaff.department,
          email: newStaff.email,
          phone: newStaff.phone,
          location: newStaff.location,
          joinDate: newStaff.join_date,
          bio: newStaff.bio,
          image: newStaff.image_url,
          createdAt: newStaff.created_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update staff member (admin/manager only)
router.put('/:id', authenticateToken, requireRole(['admin', 'manager']), uploadSingle('image'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = staffSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, role, department, email, phone, location, joinDate, bio } = value;

    // Check if staff member exists
    const existingStaff = await query(
      'SELECT id, image_url FROM staff WHERE id = $1',
      [id]
    );

    if (existingStaff.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Check if email is already taken by another staff member
    const emailCheck = await query(
      'SELECT id FROM staff WHERE email = $1 AND id != $2',
      [email, id]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email is already taken by another staff member'
      });
    }

    // Handle image upload
    let imageUrl = existingStaff.rows[0].image_url;
    if (req.file) {
      imageUrl = getFileUrl(req, req.file.path);
    }

    // Update staff member
    const result = await query(
      `UPDATE staff SET name = $1, role = $2, department = $3, email = $4, phone = $5, 
              location = $6, join_date = $7, bio = $8, image_url = $9, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $10 
       RETURNING id, name, role, department, email, phone, location, join_date, bio, image_url, updated_at`,
      [name, role, department, email, phone, location, joinDate, bio, imageUrl, id]
    );

    const updatedStaff = result.rows[0];

    res.json({
      success: true,
      message: 'Staff member updated successfully',
      data: {
        staff: {
          id: updatedStaff.id,
          name: updatedStaff.name,
          role: updatedStaff.role,
          department: updatedStaff.department,
          email: updatedStaff.email,
          phone: updatedStaff.phone,
          location: updatedStaff.location,
          joinDate: updatedStaff.join_date,
          bio: updatedStaff.bio,
          image: updatedStaff.image_url,
          updatedAt: updatedStaff.updated_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete staff member (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if staff member exists
    const existingStaff = await query(
      'SELECT id FROM staff WHERE id = $1',
      [id]
    );

    if (existingStaff.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Soft delete (set is_active to false)
    await query(
      'UPDATE staff SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      message: 'Staff member deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get departments list
router.get('/meta/departments', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT DISTINCT department FROM staff WHERE is_active = true ORDER BY department ASC'
    );

    const departments = result.rows.map(row => row.department);

    res.json({
      success: true,
      data: { departments }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
