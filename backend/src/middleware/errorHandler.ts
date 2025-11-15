import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export class AppError extends Error implements ApiError {
  public statusCode: number;
  public code: string;
  public details?: any;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Zod validation error
  if (err instanceof ZodError) {
    const validationErrors = err.errors.map((validationErr) => ({
      field: validationErr.path.join('.'),
      message: validationErr.message,
      code: validationErr.code,
    }));

    error = new AppError('Validation failed', 400, 'VALIDATION_ERROR', validationErrors);
  }

  // Database errors
  if (err.code === '23505') {
    // Unique violation
    const field = err.message.match(/Key \((.*?)\)=/)?.[1];
    error = new AppError(
      `${field || 'Resource'} already exists`,
      409,
      'DUPLICATE_ENTRY',
      { field }
    );
  } else if (err.code === '23503') {
    // Foreign key violation
    error = new AppError('Referenced resource not found', 404, 'FOREIGN_KEY_VIOLATION');
  } else if (err.code === '23502') {
    // Not null violation
    error = new AppError('Required field is missing', 400, 'REQUIRED_FIELD_MISSING');
  }

  // JWT errors
  if (err.message === 'Invalid access token' || err.message === 'Invalid refresh token') {
    error = new AppError('Invalid authentication token', 401, 'INVALID_TOKEN');
  } else if (err.message === 'Access token required') {
    error = new AppError('Authentication required', 401, 'AUTH_REQUIRED');
  } else if (err.message === 'Token expired') {
    error = new AppError('Authentication token expired', 401, 'TOKEN_EXPIRED');
  }

  // Authorization errors
  if (err.message === 'Insufficient permissions') {
    error = new AppError('You do not have permission to perform this action', 403, 'INSUFFICIENT_PERMISSIONS');
  }

  // Resource not found
  if (err.message === 'User not found' || err.message === 'Problem not found' || err.message === 'Resource not found') {
    error = new AppError('Resource not found', 404, 'RESOURCE_NOT_FOUND');
  }

  // Rate limiting
  if (err.message === 'Too many requests') {
    error = new AppError('Too many requests, please try again later', 429, 'RATE_LIMIT_EXCEEDED');
  }

  // File upload errors
  if (err.message === 'File too large') {
    error = new AppError('File size exceeds maximum allowed limit', 413, 'FILE_TOO_LARGE');
  } else if (err.message === 'Invalid file type') {
    error = new AppError('Invalid file type', 400, 'INVALID_FILE_TYPE');
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const response: any = {
    success: false,
    message: error.message || 'Internal server error',
    timestamp: new Date().toISOString(),
  };

  // Include error code for client-side handling
  if (error.code) {
    response.error = error.code;
  }

  // Include details for validation errors
  if (error.details && statusCode === 400) {
    response.details = error.details;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
  next(error);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Custom error creators
export const createError = (message: string, statusCode: number = 500, code?: string, details?: any) => {
  return new AppError(message, statusCode, code, details);
};

export const validationError = (message: string, details?: any) => {
  return new AppError(message, 400, 'VALIDATION_ERROR', details);
};

export const authenticationError = (message: string = 'Authentication required') => {
  return new AppError(message, 401, 'AUTHENTICATION_REQUIRED');
};

export const authorizationError = (message: string = 'Insufficient permissions') => {
  return new AppError(message, 403, 'INSUFFICIENT_PERMISSIONS');
};

export const notFoundError = (message: string = 'Resource not found') => {
  return new AppError(message, 404, 'RESOURCE_NOT_FOUND');
};

export const conflictError = (message: string, field?: string) => {
  return new AppError(message, 409, 'CONFLICT', { field });
};

export const rateLimitError = (message: string = 'Too many requests') => {
  return new AppError(message, 429, 'RATE_LIMIT_EXCEEDED');
};

export default {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  AppError,
  createError,
  validationError,
  authenticationError,
  authorizationError,
  notFoundError,
  conflictError,
  rateLimitError,
};