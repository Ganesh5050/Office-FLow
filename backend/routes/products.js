import express from 'express';
import { query } from '../database/connection.js';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth.js';
import { uploadSingle, getFileUrl } from '../middleware/upload.js';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const productSchema = Joi.object({
  productName: Joi.string().min(2).max(255).required(),
  productId: Joi.string().max(100).allow(''),
  description: Joi.string().max(1000).allow(''),
  email: Joi.string().email().required()
});

const statusUpdateSchema = Joi.object({
  status: Joi.string().valid('submitted', 'under-review', 'approved', 'in-production', 'shipped', 'delivered').required(),
  progress: Joi.number().min(0).max(100),
  notes: Joi.string().max(1000).allow(''),
  estimatedDelivery: Joi.date().allow('')
});

// Get all products (admin/manager only)
router.get('/', authenticateToken, requireRole(['admin', 'manager']), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const queryParams = [];
    let paramCount = 1;

    if (status) {
      whereClause += ` AND status = $${paramCount++}`;
      queryParams.push(status);
    }

    if (search) {
      whereClause += ` AND (product_name ILIKE $${paramCount++} OR product_id ILIKE $${paramCount++})`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM products ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get products
    const result = await query(
      `SELECT id, product_name, product_id, description, user_email, status, submission_date, 
              last_updated, estimated_delivery, progress, notes, document_url, created_at, updated_at
       FROM products 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramCount++} OFFSET $${paramCount++}`,
      [...queryParams, limit, offset]
    );

    const products = result.rows.map(product => ({
      id: product.id,
      productName: product.product_name,
      productId: product.product_id,
      description: product.description,
      email: product.user_email,
      status: product.status,
      submissionDate: product.submission_date,
      lastUpdated: product.last_updated,
      estimatedDelivery: product.estimated_delivery,
      progress: product.progress,
      notes: product.notes,
      documentUrl: product.document_url,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));

    res.json({
      success: true,
      data: {
        products,
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

// Create new product registration (public endpoint)
router.post('/', uploadSingle('documents'), async (req, res, next) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { productName, productId, description, email } = value;

    // Generate product ID if not provided
    let finalProductId = productId;
    if (!finalProductId || finalProductId.trim() === '') {
      // Generate a unique ID using crypto for better uniqueness
      const crypto = await import('crypto');
      const randomBytes = crypto.randomBytes(4).toString('hex');
      const timestamp = Date.now().toString(36);
      finalProductId = `PR-${timestamp}-${randomBytes}`;
    }

    // Handle document upload
    let documentUrl = null;
    if (req.file) {
      documentUrl = getFileUrl(req, req.file.path);
    }

    // Create product
    const result = await query(
      `INSERT INTO products (product_name, product_id, description, user_email, document_url) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, product_name, product_id, description, user_email, status, submission_date, document_url`,
      [productName, finalProductId, description, email, documentUrl]
    );

    const newProduct = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Product registered successfully',
      data: {
        product: {
          id: newProduct.id,
          productName: newProduct.product_name,
          productId: newProduct.product_id,
          description: newProduct.description,
          email: newProduct.user_email,
          status: newProduct.status,
          submissionDate: newProduct.submission_date,
          documentUrl: newProduct.document_url
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get product status by ID (public endpoint)
router.get('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT id, product_name, product_id, description, user_email, status, submission_date, 
              last_updated, estimated_delivery, progress, notes, document_url
       FROM products 
       WHERE product_id = $1 OR id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = result.rows[0];

    res.json({
      success: true,
      data: {
        product: {
          id: product.id,
          productName: product.product_name,
          productId: product.product_id,
          description: product.description,
          email: product.user_email,
          status: product.status,
          submissionDate: product.submission_date,
          lastUpdated: product.last_updated,
          estimatedDelivery: product.estimated_delivery,
          progress: product.progress,
          notes: product.notes,
          documentUrl: product.document_url
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update product status (admin/manager only)
router.put('/:id/status', authenticateToken, requireRole(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = statusUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { status, progress, notes, estimatedDelivery } = value;

    // Check if product exists
    const existingProduct = await query(
      'SELECT id FROM products WHERE id = $1',
      [id]
    );

    if (existingProduct.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update product status
    const result = await query(
      `UPDATE products SET status = $1, progress = $2, notes = $3, estimated_delivery = $4, 
              last_updated = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 
       RETURNING id, product_name, product_id, status, progress, notes, estimated_delivery, last_updated`,
      [status, progress || 0, notes, estimatedDelivery, id]
    );

    const updatedProduct = result.rows[0];

    res.json({
      success: true,
      message: 'Product status updated successfully',
      data: {
        product: {
          id: updatedProduct.id,
          productName: updatedProduct.product_name,
          productId: updatedProduct.product_id,
          status: updatedProduct.status,
          progress: updatedProduct.progress,
          notes: updatedProduct.notes,
          estimatedDelivery: updatedProduct.estimated_delivery,
          lastUpdated: updatedProduct.last_updated
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single product details (admin/manager only)
router.get('/:id', authenticateToken, requireRole(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT id, product_name, product_id, description, user_email, status, submission_date, 
              last_updated, estimated_delivery, progress, notes, document_url, created_at, updated_at
       FROM products 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = result.rows[0];

    res.json({
      success: true,
      data: {
        product: {
          id: product.id,
          productName: product.product_name,
          productId: product.product_id,
          description: product.description,
          email: product.user_email,
          status: product.status,
          submissionDate: product.submission_date,
          lastUpdated: product.last_updated,
          estimatedDelivery: product.estimated_delivery,
          progress: product.progress,
          notes: product.notes,
          documentUrl: product.document_url,
          createdAt: product.created_at,
          updatedAt: product.updated_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await query(
      'SELECT id FROM products WHERE id = $1',
      [id]
    );

    if (existingProduct.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete product
    await query(
      'DELETE FROM products WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get product statistics (admin/manager only)
router.get('/meta/stats', authenticateToken, requireRole(['admin', 'manager']), async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted,
        COUNT(CASE WHEN status = 'under-review' THEN 1 END) as under_review,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'in-production' THEN 1 END) as in_production,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered
      FROM products
    `);

    const stats = result.rows[0];

    res.json({
      success: true,
      data: {
        stats: {
          total: parseInt(stats.total),
          submitted: parseInt(stats.submitted),
          underReview: parseInt(stats.under_review),
          approved: parseInt(stats.approved),
          inProduction: parseInt(stats.in_production),
          shipped: parseInt(stats.shipped),
          delivered: parseInt(stats.delivered)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
