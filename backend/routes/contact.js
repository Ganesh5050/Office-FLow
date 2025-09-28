import express from 'express';
import { query } from '../database/connection.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import nodemailer from 'nodemailer';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  subject: Joi.string().min(2).max(255).required(),
  message: Joi.string().min(10).max(2000).required()
});

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Submit contact message (public endpoint)
router.post('/', async (req, res, next) => {
  try {
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, email, subject, message } = value;

    // Save message to database
    const result = await query(
      `INSERT INTO contact_messages (name, email, subject, message) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, subject, message, status, created_at`,
      [name, email, subject, message]
    );

    const newMessage = result.rows[0];

    // Send email notification (if SMTP is configured)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = createTransporter();

        const mailOptions = {
          from: process.env.SMTP_USER,
          to: process.env.SMTP_USER, // Send to admin email
          subject: `New Contact Message: ${subject}`,
          html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><em>This message was sent from the OfficeFlow contact form.</em></p>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('Contact message email sent successfully');
      } catch (emailError) {
        console.error('Failed to send contact message email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. We will get back to you soon!',
      data: {
        message: {
          id: newMessage.id,
          name: newMessage.name,
          email: newMessage.email,
          subject: newMessage.subject,
          message: newMessage.message,
          status: newMessage.status,
          createdAt: newMessage.created_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all contact messages (admin/manager only)
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
      whereClause += ` AND (name ILIKE $${paramCount++} OR email ILIKE $${paramCount++} OR subject ILIKE $${paramCount++})`;
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM contact_messages ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get messages
    const result = await query(
      `SELECT id, name, email, subject, message, status, replied_at, created_at
       FROM contact_messages 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramCount++} OFFSET $${paramCount++}`,
      [...queryParams, limit, offset]
    );

    const messages = result.rows.map(msg => ({
      id: msg.id,
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      status: msg.status,
      repliedAt: msg.replied_at,
      createdAt: msg.created_at
    }));

    res.json({
      success: true,
      data: {
        messages,
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

// Get single contact message (admin/manager only)
router.get('/:id', authenticateToken, requireRole(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT id, name, email, subject, message, status, replied_at, created_at
       FROM contact_messages 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const message = result.rows[0];

    res.json({
      success: true,
      data: {
        message: {
          id: message.id,
          name: message.name,
          email: message.email,
          subject: message.subject,
          message: message.message,
          status: message.status,
          repliedAt: message.replied_at,
          createdAt: message.created_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update message status (admin/manager only)
router.put('/:id/status', authenticateToken, requireRole(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'replied', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Check if message exists
    const existingMessage = await query(
      'SELECT id FROM contact_messages WHERE id = $1',
      [id]
    );

    if (existingMessage.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Update status
    const result = await query(
      `UPDATE contact_messages SET status = $1, replied_at = CASE WHEN $1 = 'replied' THEN CURRENT_TIMESTAMP ELSE replied_at END
       WHERE id = $2 
       RETURNING id, status, replied_at`,
      [status, id]
    );

    const updatedMessage = result.rows[0];

    res.json({
      success: true,
      message: 'Message status updated successfully',
      data: {
        message: {
          id: updatedMessage.id,
          status: updatedMessage.status,
          repliedAt: updatedMessage.replied_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Reply to contact message (admin/manager only)
router.post('/:id/reply', authenticateToken, requireRole(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage || replyMessage.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required'
      });
    }

    // Get original message
    const messageResult = await query(
      'SELECT id, name, email, subject, message FROM contact_messages WHERE id = $1',
      [id]
    );

    if (messageResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const originalMessage = messageResult.rows[0];

    // Send reply email (if SMTP is configured)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = createTransporter();

        const mailOptions = {
          from: process.env.SMTP_USER,
          to: originalMessage.email,
          subject: `Re: ${originalMessage.subject}`,
          html: `
            <h2>Reply from OfficeFlow</h2>
            <p>Dear ${originalMessage.name},</p>
            <p>Thank you for contacting us. Here is our response:</p>
            <div style="background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #007bff;">
              ${replyMessage.replace(/\n/g, '<br>')}
            </div>
            <p>Best regards,<br>OfficeFlow Team</p>
            <hr>
            <p><em>Original message:</em></p>
            <p><strong>Subject:</strong> ${originalMessage.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${originalMessage.message.replace(/\n/g, '<br>')}</p>
          `
        };

        await transporter.sendMail(mailOptions);

        // Update message status to replied
        await query(
          'UPDATE contact_messages SET status = $1, replied_at = CURRENT_TIMESTAMP WHERE id = $2',
          ['replied', id]
        );

        console.log('Reply email sent successfully');
      } catch (emailError) {
        console.error('Failed to send reply email:', emailError);
        return res.status(500).json({
          success: false,
          message: 'Failed to send reply email'
        });
      }
    } else {
      // Update status even if email is not configured
      await query(
        'UPDATE contact_messages SET status = $1, replied_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['replied', id]
      );
    }

    res.json({
      success: true,
      message: 'Reply sent successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Delete contact message (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if message exists
    const existingMessage = await query(
      'SELECT id FROM contact_messages WHERE id = $1',
      [id]
    );

    if (existingMessage.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Delete message
    await query(
      'DELETE FROM contact_messages WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get contact message statistics (admin/manager only)
router.get('/meta/stats', authenticateToken, requireRole(['admin', 'manager']), async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new,
        COUNT(CASE WHEN status = 'read' THEN 1 END) as read,
        COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as recent
      FROM contact_messages
    `);

    const stats = result.rows[0];

    res.json({
      success: true,
      data: {
        stats: {
          total: parseInt(stats.total),
          new: parseInt(stats.new),
          read: parseInt(stats.read),
          replied: parseInt(stats.replied),
          closed: parseInt(stats.closed),
          recent: parseInt(stats.recent)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
