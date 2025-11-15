import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import { authService } from '@/services/authService';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import logger from '@/utils/logger';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password, firstName, lastName } = req.body;

    const result = await authService.register({
      username,
      email,
      password,
      firstName,
      lastName,
    });

    logger.info('User registered successfully', {
      userId: result.user.id,
      username: result.user.username,
      email: result.user.email,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      data: {
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role,
          isEmailVerified: result.user.isEmailVerified,
        },
      },
      timestamp: new Date().toISOString(),
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip;

    const result = await authService.login({
      email,
      password,
      userAgent,
      ipAddress,
    });

    logger.auth('login', result.user.id, ipAddress, userAgent, true);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role,
          isEmailVerified: result.user.isEmailVerified,
        },
        tokens: result.tokens,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  refreshToken: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError('Refresh token is required', 400, 'MISSING_REFRESH_TOKEN');
    }

    const result = await authService.refreshToken(refreshToken);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        tokens: result,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    await authService.logout(token, refreshToken);

    res.json({
      success: true,
      message: 'Logout successful',
      timestamp: new Date().toISOString(),
    });
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    await authService.forgotPassword(email);

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
      timestamp: new Date().toISOString(),
    });
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    await authService.resetPassword(token, newPassword);

    res.json({
      success: true,
      message: 'Password reset successful',
      timestamp: new Date().toISOString(),
    });
  }),

  verifyEmail: asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;

    await authService.verifyEmail(token);

    res.json({
      success: true,
      message: 'Email verified successfully',
      timestamp: new Date().toISOString(),
    });
  }),

  resendVerification: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    await authService.resendVerification(email);

    res.json({
      success: true,
      message: 'Verification email sent',
      timestamp: new Date().toISOString(),
    });
  }),

  changePassword: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.userId;

    await authService.changePassword(userId, currentPassword, newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully',
      timestamp: new Date().toISOString(),
    });
  }),

  getMe: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.userId;

    const user = await authService.getMe(userId);

    res.json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user,
      },
      timestamp: new Date().toISOString(),
    });
  }),
};

