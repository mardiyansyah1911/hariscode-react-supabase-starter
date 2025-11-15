import { Router } from 'express';
import { authController } from '@/controllers/authController';
import {
  authenticateToken,
  authLimiter,
  passwordResetLimiter,
} from '@/middleware';
import {
  validateBody,
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Public routes (no authentication required)
router.post('/register',
  authLimiter,
  validateBody(registerSchema),
  asyncHandler(authController.register)
);

router.post('/login',
  authLimiter,
  validateBody(loginSchema),
  asyncHandler(authController.login)
);

router.post('/refresh',
  asyncHandler(authController.refreshToken)
);

router.post('/logout',
  asyncHandler(authController.logout)
);

router.post('/forgot-password',
  passwordResetLimiter,
  validateBody(forgotPasswordSchema),
  asyncHandler(authController.forgotPassword)
);

router.post('/reset-password',
  validateBody(resetPasswordSchema),
  asyncHandler(authController.resetPassword)
);

router.post('/verify-email',
  asyncHandler(authController.verifyEmail)
);

router.post('/resend-verification',
  authLimiter,
  asyncHandler(authController.resendVerification)
);

// Protected routes (authentication required)
router.post('/change-password',
  authenticateToken,
  validateBody(changePasswordSchema),
  asyncHandler(authController.changePassword)
);

router.get('/me',
  authenticateToken,
  asyncHandler(authController.getMe)
);

export default router;