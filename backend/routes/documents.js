import express from 'express';
import { query } from '../database/connection.js';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth.js';
import { uploadMultiple, getFileUrl, deleteFile } from '../middleware/upload.js';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const documentSchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  description: Joi.string().max(1000).allow(''),
  category: Joi.string().max(100).allow(''),
  tags: Joi.array().items(Joi.string()).default([]),
  isPublic: Joi.boolean().default(false)
});

// Get all documents (public documents for non-authenticated users, all for authenticated)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, search, tags } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const queryParams = [];
    let paramCount = 1;

    // If not authenticated, only show public documents
    if (!req.user) {
      whereClause += ` AND is_public = true`;
    }

    if (category) {
      whereClause += ` AND category = $${paramCount++}`;
      queryParams.push(category);
    }

    if (search) {
      whereClause += ` AND (title ILIKE $${paramCount++} OR description ILIKE $${paramCount++})`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      whereClause += ` AND tags && $${paramCount++}`;
      queryParams.push(tagArray);
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM documents ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get documents
    const result = await query(
      `SELECT d.id, d.title, d.description, d.file_url, d.file_type, d.file_size, 
              d.category, d.tags, d.is_public, d.created_at, d.updated_at,
              u.first_name, u.last_name
       FROM documents d
       LEFT JOIN users u ON d.uploaded_by = u.id
       ${whereClause}
       ORDER BY d.created_at DESC
       LIMIT $${paramCount++} OFFSET $${paramCount++}`,
      [...queryParams, limit, offset]
    );

    const documents = result.rows.map(doc => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      fileUrl: doc.file_url,
      fileType: doc.file_type,
      fileSize: doc.file_size,
      category: doc.category,
      tags: doc.tags || [],
      isPublic: doc.is_public,
      uploadedBy: doc.first_name && doc.last_name ? `${doc.first_name} ${doc.last_name}` : 'System',
      createdAt: doc.created_at,
      updatedAt: doc.updated_at
    }));

    res.json({
      success: true,
      data: {
        documents,
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

// Get single document
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    let whereClause = 'WHERE d.id = $1';
    const queryParams = [id];

    // If not authenticated, only show public documents
    if (!req.user) {
      whereClause += ` AND d.is_public = true`;
    }

    const result = await query(
      `SELECT d.id, d.title, d.description, d.file_url, d.file_type, d.file_size, 
              d.category, d.tags, d.is_public, d.created_at, d.updated_at,
              u.first_name, u.last_name
       FROM documents d
       LEFT JOIN users u ON d.uploaded_by = u.id
       ${whereClause}`,
      queryParams
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const doc = result.rows[0];

    res.json({
      success: true,
      data: {
        document: {
          id: doc.id,
          title: doc.title,
          description: doc.description,
          fileUrl: doc.file_url,
          fileType: doc.file_type,
          fileSize: doc.file_size,
          category: doc.category,
          tags: doc.tags || [],
          isPublic: doc.is_public,
          uploadedBy: doc.first_name && doc.last_name ? `${doc.first_name} ${doc.last_name}` : 'System',
          createdAt: doc.created_at,
          updatedAt: doc.updated_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Upload new document (authenticated users)
router.post('/', authenticateToken, uploadMultiple('files', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const { title, description, category, tags, isPublic } = req.body;

    // Validate document metadata
    const { error, value } = documentSchema.validate({
      title,
      description,
      category,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      isPublic: isPublic === 'true'
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const documents = [];

    // Process each uploaded file
    for (const file of req.files) {
      const fileUrl = getFileUrl(req, file.path);

      // Create document record
      const result = await query(
        `INSERT INTO documents (title, description, file_url, file_type, file_size, category, tags, is_public, uploaded_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING id, title, description, file_url, file_type, file_size, category, tags, is_public, created_at`,
        [
          value.title,
          value.description,
          fileUrl,
          file.mimetype,
          file.size,
          value.category,
          value.tags,
          value.isPublic,
          req.user.id
        ]
      );

      const newDoc = result.rows[0];

      documents.push({
        id: newDoc.id,
        title: newDoc.title,
        description: newDoc.description,
        fileUrl: newDoc.file_url,
        fileType: newDoc.file_type,
        fileSize: newDoc.file_size,
        category: newDoc.category,
        tags: newDoc.tags || [],
        isPublic: newDoc.is_public,
        createdAt: newDoc.created_at
      });
    }

    res.status(201).json({
      success: true,
      message: `${documents.length} document(s) uploaded successfully`,
      data: { documents }
    });
  } catch (error) {
    next(error);
  }
});

// Update document (admin/manager only)
router.put('/:id', authenticateToken, requireRole(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = documentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { title, description, category, tags, isPublic } = value;

    // Check if document exists
    const existingDoc = await query(
      'SELECT id FROM documents WHERE id = $1',
      [id]
    );

    if (existingDoc.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Update document
    const result = await query(
      `UPDATE documents SET title = $1, description = $2, category = $3, tags = $4, is_public = $5, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6 
       RETURNING id, title, description, file_url, file_type, file_size, category, tags, is_public, updated_at`,
      [title, description, category, tags, isPublic, id]
    );

    const updatedDoc = result.rows[0];

    res.json({
      success: true,
      message: 'Document updated successfully',
      data: {
        document: {
          id: updatedDoc.id,
          title: updatedDoc.title,
          description: updatedDoc.description,
          fileUrl: updatedDoc.file_url,
          fileType: updatedDoc.file_type,
          fileSize: updatedDoc.file_size,
          category: updatedDoc.category,
          tags: updatedDoc.tags || [],
          isPublic: updatedDoc.is_public,
          updatedAt: updatedDoc.updated_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete document (admin/manager only)
router.delete('/:id', authenticateToken, requireRole(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get document details
    const result = await query(
      'SELECT id, file_url FROM documents WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const doc = result.rows[0];

    // Delete file from filesystem
    if (doc.file_url) {
      const filePath = doc.file_url.replace(/^.*\/uploads\//, './uploads/');
      deleteFile(filePath);
    }

    // Delete document record
    await query(
      'DELETE FROM documents WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get document categories
router.get('/meta/categories', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT DISTINCT category FROM documents WHERE category IS NOT NULL ORDER BY category ASC'
    );

    const categories = result.rows.map(row => row.category);

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
});

// Get document statistics (admin/manager only)
router.get('/meta/stats', authenticateToken, requireRole(['admin', 'manager']), async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN is_public = true THEN 1 END) as public,
        COUNT(CASE WHEN is_public = false THEN 1 END) as private,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as recent
      FROM documents
    `);

    const stats = result.rows[0];

    res.json({
      success: true,
      data: {
        stats: {
          total: parseInt(stats.total),
          public: parseInt(stats.public),
          private: parseInt(stats.private),
          recent: parseInt(stats.recent)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
