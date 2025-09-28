export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    message: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      success: false,
      message,
      statusCode: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      success: false,
      message: 'Invalid token',
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      success: false,
      message: 'Token expired',
      statusCode: 401
    };
  }

  // PostgreSQL errors
  if (err.code === '23505') { // Unique violation
    error = {
      success: false,
      message: 'Duplicate entry. This record already exists.',
      statusCode: 409
    };
  }

  if (err.code === '23503') { // Foreign key violation
    error = {
      success: false,
      message: 'Referenced record does not exist.',
      statusCode: 400
    };
  }

  if (err.code === '23502') { // Not null violation
    error = {
      success: false,
      message: 'Required field is missing.',
      statusCode: 400
    };
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      success: false,
      message: 'File too large. Maximum size is 10MB.',
      statusCode: 400
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = {
      success: false,
      message: 'Unexpected file field.',
      statusCode: 400
    };
  }

  // Development vs Production error response
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  res.status(error.statusCode).json(error);
};
