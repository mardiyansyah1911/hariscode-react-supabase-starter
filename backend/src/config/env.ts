import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().default('hariscode'),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().default('hariscode'),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // Server
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_VERSION: z.string().default('v1'),

  // Code Execution
  CODE_EXECUTION_TIMEOUT: z.coerce.number().default(30000),
  MAX_MEMORY_USAGE: z.coerce.number().default(128000000),
  MAX_CPU_TIME: z.coerce.number().default(5000),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  FROM_EMAIL: z.string().optional(),
  FROM_NAME: z.string().default('Haris Code'),

  // External Services
  JUDGE0_API_KEY: z.string().optional(),
  JUDGE0_BASE_URL: z.string().default('https://api.judge0.com'),

  // Security
  BCRYPT_ROUNDS: z.coerce.number().default(12),
  RATE_LIMIT_WINDOW: z.coerce.number().default(15),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Frontend
  FRONTEND_URL: z.string().default('http://localhost:5173'),

  // File Upload
  MAX_FILE_SIZE: z.coerce.number().default(10485760), // 10MB
  UPLOAD_PATH: z.string().default('./uploads'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE: z.string().default('./logs/app.log'),

  // Redis (Optional)
  REDIS_URL: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),

  // Development
  DEBUG: z.coerce.boolean().default(false),
  MOCK_EMAIL: z.coerce.boolean().default(true),
});

const env = envSchema.parse(process.env);

export default env;