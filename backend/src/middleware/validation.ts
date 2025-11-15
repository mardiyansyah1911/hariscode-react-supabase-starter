import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodError } from 'zod';

export interface ValidatedRequest<T = any> extends Request {
  validatedBody?: T;
  validatedParams?: T;
  validatedQuery?: T;
}

export const validateBody = (schema: ZodSchema) => {
  return (req: ValidatedRequest, res: Response, next: NextFunction) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: 'VALIDATION_ERROR',
          details: validationErrors,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
        error: 'INVALID_BODY',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: ValidatedRequest, res: Response, next: NextFunction) => {
    try {
      req.validatedParams = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          message: 'Invalid request parameters',
          error: 'VALIDATION_ERROR',
          details: validationErrors,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        error: 'INVALID_PARAMS',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: ValidatedRequest, res: Response, next: NextFunction) => {
    try {
      req.validatedQuery = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          error: 'VALIDATION_ERROR',
          details: validationErrors,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        error: 'INVALID_QUERY',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

// Common validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const usernameParamSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
});

// User validation schemas
export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
});

export const updatePreferencesSchema = z.object({
  preferredLanguage: z.enum(['javascript', 'python', 'php', 'html', 'css', 'java', 'cpp', 'csharp', 'ruby', 'go', 'rust', 'typescript']).optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  language: z.enum(['en', 'id']).optional(),
  notifications: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    achievements: z.boolean().optional(),
    leaderboard: z.boolean().optional(),
    newProblems: z.boolean().optional(),
  }).optional(),
  editorSettings: z.object({
    fontSize: z.number().min(10).max(32).optional(),
    tabSize: z.number().min(1).max(8).optional(),
    wordWrap: z.boolean().optional(),
    minimap: z.boolean().optional(),
    theme: z.string().optional(),
  }).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

// Problem validation schemas
export const createProblemSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  difficulty: z.coerce.number().int().min(1).max(6),
  language: z.enum(['javascript', 'python', 'php', 'html', 'css', 'java', 'cpp', 'csharp', 'ruby', 'go', 'rust', 'typescript']),
  category: z.string().min(1).max(100),
  type: z.enum(['debugging', 'code_completion', 'error_fixing', 'algorithm_implementation', 'code_refactoring']),
  points: z.coerce.number().int().min(10).max(1000),
  timeLimit: z.coerce.number().int().min(1000).max(60000),
  memoryLimit: z.coerce.number().int().min(16000000).max(512000000),
  inputFormat: z.string().optional(),
  outputFormat: z.string().optional(),
  constraints: z.string().optional(),
  sampleInput: z.string().optional(),
  sampleOutput: z.string().optional(),
  explanation: z.string().optional(),
  hints: z.array(z.string()).max(10).default([]),
  maxHints: z.coerce.number().int().min(0).max(10).default(5),
  starterCode: z.record(z.string()).optional(),
  solutionCode: z.record(z.string()).optional(),
  testCases: z.array(z.object({
    input: z.string(),
    expectedOutput: z.string(),
    isHidden: z.boolean().default(false),
    isSample: z.boolean().default(false),
    weight: z.coerce.number().int().min(1).max(10).default(1),
    explanation: z.string().optional(),
  })).min(1),
  tags: z.array(z.string()).max(20).default([]),
  isPublished: z.boolean().default(false),
});

export const updateProblemSchema = createProblemSchema.partial();

export const problemFilterSchema = z.object({
  difficulty: z.array(z.coerce.number().int().min(1).max(6)).optional(),
  language: z.array(z.enum(['javascript', 'python', 'php', 'html', 'css', 'java', 'cpp', 'csharp', 'ruby', 'go', 'rust', 'typescript'])).optional(),
  category: z.array(z.string()).optional(),
  type: z.array(z.enum(['debugging', 'code_completion', 'error_fixing', 'algorithm_implementation', 'code_refactoring'])).optional(),
  tags: z.array(z.string()).optional(),
  minPoints: z.coerce.number().int().min(0).optional(),
  maxPoints: z.coerce.number().int().max(1000).optional(),
  solvedStatus: z.enum(['all', 'solved', 'unsolved', 'attempted']).optional(),
  search: z.string().optional(),
});

// Submission validation schemas
export const createSubmissionSchema = z.object({
  problemId: z.string().uuid(),
  code: z.string().min(1).max(10000),
  language: z.enum(['javascript', 'python', 'php', 'html', 'css', 'java', 'cpp', 'csharp', 'ruby', 'go', 'rust', 'typescript']),
  timeSpent: z.coerce.number().int().min(0).optional(),
});

export const codeExecutionSchema = z.object({
  code: z.string().min(1).max(10000),
  language: z.enum(['javascript', 'python', 'php', 'html', 'css', 'java', 'cpp', 'csharp', 'ruby', 'go', 'rust', 'typescript']),
  input: z.string().optional(),
  timeLimit: z.coerce.number().int().min(1000).max(60000).optional(),
  memoryLimit: z.coerce.number().int().min(16000000).max(512000000).optional(),
});

export default {
  validateBody,
  validateParams,
  validateQuery,
  paginationSchema,
  idParamSchema,
  usernameParamSchema,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updatePreferencesSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  createProblemSchema,
  updateProblemSchema,
  problemFilterSchema,
  createSubmissionSchema,
  codeExecutionSchema,
};