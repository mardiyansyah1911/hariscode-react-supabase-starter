import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import env from '@/config/env';

// General rate limiter for all API endpoints
export const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW * 60 * 1000, // Convert minutes to milliseconds
  max: env.RATE_LIMIT_MAX,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later',
    error: 'RATE_LIMIT_EXCEEDED',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req: Request) => {
    return req.ip || 'unknown';
  },
  skip: (req: Request) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/api/health';
  },
});

// Stricter rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    error: 'AUTH_RATE_LIMIT_EXCEEDED',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Use IP + email for login attempts to prevent email enumeration attacks
    const email = req.body?.email || '';
    return `${req.ip || 'unknown'}:${email}`;
  },
  skipFailedRequests: false,
  skipSuccessfulRequests: false,
});

// Rate limiter for password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset requests, please try again later',
    error: 'PASSWORD_RESET_RATE_LIMIT_EXCEEDED',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    const email = req.body?.email || '';
    return `password-reset:${req.ip || 'unknown'}:${email}`;
  },
});

// Rate limiter for code submissions
export const submissionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 submissions per minute
  message: {
    success: false,
    message: 'Too many submissions, please wait before submitting again',
    error: 'SUBMISSION_RATE_LIMIT_EXCEEDED',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.ip || 'unknown';
  },
});

// Rate limiter for code execution (playground/testing)
export const codeExecutionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 code executions per minute
  message: {
    success: false,
    message: 'Too many code executions, please wait before trying again',
    error: 'CODE_EXECUTION_RATE_LIMIT_EXCEEDED',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.ip || 'unknown';
  },
});

// Rate limiter for file uploads
export const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 uploads per 10 minutes
  message: {
    success: false,
    message: 'Too many file uploads, please wait before uploading again',
    error: 'UPLOAD_RATE_LIMIT_EXCEEDED',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.ip || 'unknown';
  },
  // Increase the size limit for uploads
  skip: (req: Request) => {
    // Don't rate limit small requests
    const contentLength = parseInt(req.headers['content-length'] || '0');
    return contentLength < 1024 * 1024; // Less than 1MB
  },
});

// Rate limiter for admin operations
export const adminLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // 50 admin operations per 5 minutes
  message: {
    success: false,
    message: 'Too many admin operations, please slow down',
    error: 'ADMIN_RATE_LIMIT_EXCEEDED',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.ip || 'unknown';
  },
});

// Rate limiter for search operations
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: {
    success: false,
    message: 'Too many search requests, please slow down',
    error: 'SEARCH_RATE_LIMIT_EXCEEDED',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.ip || 'unknown';
  },
});

// Create user-specific rate limiter (for authenticated users)
export const createUserLimiter = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Rate limit exceeded',
      error: 'USER_RATE_LIMIT_EXCEEDED',
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
      // Try to get user ID from authenticated request
      const userId = (req as any).userId || (req as any).user?.userId;
      return userId ? `user:${userId}` : req.ip || 'unknown';
    },
  });
};

// User-specific submission limiter
export const userSubmissionLimiter = createUserLimiter(
  1 * 60 * 1000, // 1 minute
  15, // 15 submissions per minute per user
  'Too many submissions, please wait before submitting again'
);

// User-specific code execution limiter
export const userCodeExecutionLimiter = createUserLimiter(
  1 * 60 * 1000, // 1 minute
  30, // 30 executions per minute per user
  'Too many code executions, please wait before trying again'
);

export default {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  submissionLimiter,
  codeExecutionLimiter,
  uploadLimiter,
  adminLimiter,
  searchLimiter,
  createUserLimiter,
  userSubmissionLimiter,
  userCodeExecutionLimiter,
};