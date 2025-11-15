import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import env from '@/config/env';
import logger from '@/utils/logger';
import { notFoundHandler, errorHandler } from '@/middleware/errorHandler';
import { generalLimiter } from '@/middleware/rateLimiter';

// Import routes
import routes from '@/routes';

const app = express();

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow the configured frontend URL
    if (origin === env.CORS_ORIGIN || origin === env.FRONTEND_URL) {
      return callback(null, true);
    }

    // In development, allow all origins
    if (env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Custom Morgan format for production
  morgan.format('json', JSON.stringify({
    method: ':method',
    url: ':url',
    status: ':status',
    responseTime: ':response-time ms',
    ip: ':remote-addr',
    userAgent: ':user-agent',
    timestamp: ':date[iso]',
  }));

  app.use(morgan('json', {
    stream: {
      write: (message: string) => {
        try {
          const logData = JSON.parse(message);
          logger.logRequest(
            { method: logData.method, originalUrl: logData.url, ip: logData.ip },
            { statusCode: logData.status },
            parseInt(logData.responseTime)
          );
        } catch (error) {
          logger.error('Failed to parse Morgan log', { message, error: error as Error });
        }
      },
    },
  }));
}

// General rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: env.NODE_ENV,
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected', // We'll add actual database health check later
      redis: 'disconnected', // Will be implemented if Redis is added
      judge0: env.JUDGE0_API_KEY ? 'configured' : 'not_configured',
    },
  });
});

// API routes
app.use('/api', (req, res, next) => {
  // API version header
  res.setHeader('X-API-Version', env.API_VERSION);
  next();
});

// Mount API routes
app.use('/api', routes);

// Serve static files for uploads
app.use('/uploads', express.static(env.UPLOAD_PATH, {
  maxAge: '1d', // Cache for 1 day
  etag: true,
  lastModified: true,
}));

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

export default app;