import express from 'express';
import { query } from '../database/connection.js';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth.js';
import { uploadSingle, getFileUrl } from '../middleware/upload.js';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const facilitySchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  type: Joi.string().min(2).max(100).required(),
  capacity: Joi.number().min(1).max(1000).required(),
  description: Joi.string().max(1000).allow(''),
  amenities: Joi.array().items(Joi.string()).default([]),
  location: Joi.string().min(2).max(255).required(),
  pricePerHour: Joi.number().min(0).required()
});

const bookingSchema = Joi.object({
  facilityId: Joi.string().uuid().required(),
  bookingDate: Joi.date().required(),
  startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  notes: Joi.string().max(500).allow('')
});

// Get all facilities (public endpoint)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, availability, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE f.is_active = true';
    const queryParams = [];
    let paramCount = 1;

    if (type) {
      whereClause += ` AND f.type = $${paramCount++}`;
      queryParams.push(type);
    }

    if (availability) {
      whereClause += ` AND f.availability = $${paramCount++}`;
      queryParams.push(availability);
    }

    if (search) {
      whereClause += ` AND (f.name ILIKE $${paramCount++} OR f.description ILIKE $${paramCount++})`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM facilities f ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get facilities
    const result = await query(
      `SELECT f.id, f.name, f.type, f.capacity, f.availability, f.description, 
              f.amenities, f.location, f.price_per_hour, f.image_url, f.created_at, f.updated_at
       FROM facilities f 
       ${whereClause}
       ORDER BY f.name ASC
       LIMIT $${paramCount++} OFFSET $${paramCount++}`,
      [...queryParams, limit, offset]
    );

    const facilities = result.rows.map(facility => ({
      id: facility.id,
      name: facility.name,
      type: facility.type,
      capacity: facility.capacity,
      availability: facility.availability,
      description: facility.description,
      amenities: facility.amenities || [],
      location: facility.location,
      pricePerHour: parseFloat(facility.price_per_hour),
      image: facility.image_url,
      createdAt: facility.created_at,
      updatedAt: facility.updated_at
    }));

    res.json({
      success: true,
      data: {
        facilities,
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

// Get single facility
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT f.id, f.name, f.type, f.capacity, f.availability, f.description, 
              f.amenities, f.location, f.price_per_hour, f.image_url, f.created_at, f.updated_at
       FROM facilities f 
       WHERE f.id = $1 AND f.is_active = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    const facility = result.rows[0];

    res.json({
      success: true,
      data: {
        facility: {
          id: facility.id,
          name: facility.name,
          type: facility.type,
          capacity: facility.capacity,
          availability: facility.availability,
          description: facility.description,
          amenities: facility.amenities || [],
          location: facility.location,
          pricePerHour: parseFloat(facility.price_per_hour),
          image: facility.image_url,
          createdAt: facility.created_at,
          updatedAt: facility.updated_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create new facility (admin/manager only)
router.post('/', authenticateToken, requireRole(['admin', 'manager']), uploadSingle('image'), async (req, res, next) => {
  try {
    const { error, value } = facilitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, type, capacity, description, amenities, location, pricePerHour } = value;

    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      imageUrl = getFileUrl(req, req.file.path);
    }

    // Create facility
    const result = await query(
      `INSERT INTO facilities (name, type, capacity, description, amenities, location, price_per_hour, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, name, type, capacity, availability, description, amenities, location, price_per_hour, image_url, created_at`,
      [name, type, capacity, description, amenities, location, pricePerHour, imageUrl]
    );

    const newFacility = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Facility created successfully',
      data: {
        facility: {
          id: newFacility.id,
          name: newFacility.name,
          type: newFacility.type,
          capacity: newFacility.capacity,
          availability: newFacility.availability,
          description: newFacility.description,
          amenities: newFacility.amenities || [],
          location: newFacility.location,
          pricePerHour: parseFloat(newFacility.price_per_hour),
          image: newFacility.image_url,
          createdAt: newFacility.created_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update facility (admin/manager only)
router.put('/:id', authenticateToken, requireRole(['admin', 'manager']), uploadSingle('image'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = facilitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, type, capacity, description, amenities, location, pricePerHour } = value;

    // Check if facility exists
    const existingFacility = await query(
      'SELECT id, image_url FROM facilities WHERE id = $1',
      [id]
    );

    if (existingFacility.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    // Handle image upload
    let imageUrl = existingFacility.rows[0].image_url;
    if (req.file) {
      imageUrl = getFileUrl(req, req.file.path);
    }

    // Update facility
    const result = await query(
      `UPDATE facilities SET name = $1, type = $2, capacity = $3, description = $4, amenities = $5, 
              location = $6, price_per_hour = $7, image_url = $8, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $9 
       RETURNING id, name, type, capacity, availability, description, amenities, location, price_per_hour, image_url, updated_at`,
      [name, type, capacity, description, amenities, location, pricePerHour, imageUrl, id]
    );

    const updatedFacility = result.rows[0];

    res.json({
      success: true,
      message: 'Facility updated successfully',
      data: {
        facility: {
          id: updatedFacility.id,
          name: updatedFacility.name,
          type: updatedFacility.type,
          capacity: updatedFacility.capacity,
          availability: updatedFacility.availability,
          description: updatedFacility.description,
          amenities: updatedFacility.amenities || [],
          location: updatedFacility.location,
          pricePerHour: parseFloat(updatedFacility.price_per_hour),
          image: updatedFacility.image_url,
          updatedAt: updatedFacility.updated_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update facility availability (admin/manager only)
router.put('/:id/availability', authenticateToken, requireRole(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { availability } = req.body;

    if (!['available', 'occupied', 'maintenance'].includes(availability)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid availability status'
      });
    }

    // Check if facility exists
    const existingFacility = await query(
      'SELECT id FROM facilities WHERE id = $1',
      [id]
    );

    if (existingFacility.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    // Update availability
    const result = await query(
      `UPDATE facilities SET availability = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, name, availability, updated_at`,
      [availability, id]
    );

    const updatedFacility = result.rows[0];

    res.json({
      success: true,
      message: 'Facility availability updated successfully',
      data: {
        facility: {
          id: updatedFacility.id,
          name: updatedFacility.name,
          availability: updatedFacility.availability,
          updatedAt: updatedFacility.updated_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Book facility (authenticated users)
router.post('/book', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = bookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { facilityId, bookingDate, startTime, endTime, notes } = value;

    // Check if facility exists and is available
    const facilityResult = await query(
      'SELECT id, name, availability, price_per_hour FROM facilities WHERE id = $1 AND is_active = true',
      [facilityId]
    );

    if (facilityResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    const facility = facilityResult.rows[0];

    if (facility.availability !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Facility is not available for booking'
      });
    }

    // Check for time conflicts
    const conflictResult = await query(
      `SELECT id FROM facility_bookings 
       WHERE facility_id = $1 AND booking_date = $2 
       AND status IN ('pending', 'confirmed')
       AND (
         (start_time <= $3 AND end_time > $3) OR
         (start_time < $4 AND end_time >= $4) OR
         (start_time >= $3 AND end_time <= $4)
       )`,
      [facilityId, bookingDate, startTime, endTime]
    );

    if (conflictResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Time slot is already booked'
      });
    }

    // Calculate total cost
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const duration = endHour - startHour;
    const totalCost = duration * parseFloat(facility.price_per_hour);

    // Create booking
    const result = await query(
      `INSERT INTO facility_bookings (facility_id, user_id, booking_date, start_time, end_time, total_cost, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, facility_id, booking_date, start_time, end_time, total_cost, status, created_at`,
      [facilityId, req.user.id, bookingDate, startTime, endTime, totalCost, notes]
    );

    const newBooking = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Facility booked successfully',
      data: {
        booking: {
          id: newBooking.id,
          facilityId: newBooking.facility_id,
          facilityName: facility.name,
          bookingDate: newBooking.booking_date,
          startTime: newBooking.start_time,
          endTime: newBooking.end_time,
          totalCost: parseFloat(newBooking.total_cost),
          status: newBooking.status,
          createdAt: newBooking.created_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user bookings (authenticated users)
router.get('/bookings/my', authenticateToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE fb.user_id = $1';
    const queryParams = [req.user.id];
    let paramCount = 2;

    if (status) {
      whereClause += ` AND fb.status = $${paramCount++}`;
      queryParams.push(status);
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM facility_bookings fb ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get bookings
    const result = await query(
      `SELECT fb.id, fb.facility_id, fb.booking_date, fb.start_time, fb.end_time, 
              fb.total_cost, fb.status, fb.notes, fb.created_at, f.name as facility_name
       FROM facility_bookings fb
       JOIN facilities f ON fb.facility_id = f.id
       ${whereClause}
       ORDER BY fb.booking_date DESC, fb.start_time DESC
       LIMIT $${paramCount++} OFFSET $${paramCount++}`,
      [...queryParams, limit, offset]
    );

    const bookings = result.rows.map(booking => ({
      id: booking.id,
      facilityId: booking.facility_id,
      facilityName: booking.facility_name,
      bookingDate: booking.booking_date,
      startTime: booking.start_time,
      endTime: booking.end_time,
      totalCost: parseFloat(booking.total_cost),
      status: booking.status,
      notes: booking.notes,
      createdAt: booking.created_at
    }));

    res.json({
      success: true,
      data: {
        bookings,
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

// Delete facility (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if facility exists
    const existingFacility = await query(
      'SELECT id FROM facilities WHERE id = $1',
      [id]
    );

    if (existingFacility.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    // Soft delete (set is_active to false)
    await query(
      'UPDATE facilities SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      message: 'Facility deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get facility types and availability options
router.get('/meta/options', async (req, res, next) => {
  try {
    const typesResult = await query(
      'SELECT DISTINCT type FROM facilities WHERE is_active = true ORDER BY type ASC'
    );

    const types = typesResult.rows.map(row => row.type);

    res.json({
      success: true,
      data: {
        types,
        availabilityOptions: ['available', 'occupied', 'maintenance'],
        statusOptions: ['pending', 'confirmed', 'cancelled', 'completed']
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
