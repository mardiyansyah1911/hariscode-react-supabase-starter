import { Request, Response, NextFunction } from 'express';
import { JWTService, JWTPayload } from '@/config/jwt';
import { db } from '@/config/database';
import { users, userSessions } from '@/models/schema';
import { eq } from 'drizzle-orm';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
  userId?: string;
  headers: any;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        error: 'MISSING_TOKEN',
        timestamp: new Date().toISOString(),
      });
    }

    // Verify JWT token
    const payload = JWTService.verifyAccessToken(token);

    // Check if user exists and is active
    const user = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        isEmailVerified: users.isEmailVerified,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user.length) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND',
        timestamp: new Date().toISOString(),
      });
    }

    const userData = user[0];
    if (!userData || !userData.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated',
        error: 'ACCOUNT_DEACTIVATED',
        timestamp: new Date().toISOString(),
      });
    }

    // Check if session is still valid
    const session = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.token, token))
      .limit(1);

    if (!session.length || !session[0].isActive || session[0].expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session',
        error: 'SESSION_EXPIRED',
        timestamp: new Date().toISOString(),
      });
    }

    // Attach user info to request
    req.user = {
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
      role: userData.role as 'user' | 'admin',
    };
    req.userId = payload.userId;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'INVALID_TOKEN',
      timestamp: new Date().toISOString(),
    });
  }
};

export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
        error: 'INSUFFICIENT_PERMISSIONS',
        timestamp: new Date().toISOString(),
      });
    }

    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
};

export const requireEmailVerification = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED',
        timestamp: new Date().toISOString(),
      });
    }

    const user = await db
      .select({ isEmailVerified: users.isEmailVerified })
      .from(users)
      .where(eq(users.id, req.user.userId))
      .limit(1);

    if (!user.length || !user[0].isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Email verification required',
        error: 'EMAIL_NOT_VERIFIED',
        timestamp: new Date().toISOString(),
      });
    }

    next();
  } catch (error) {
    console.error('Email verification check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const payload = JWTService.verifyAccessToken(token);

        const user = await db
          .select({
            id: users.id,
            username: users.username,
            email: users.email,
            role: users.role,
            isActive: users.isActive,
          })
          .from(users)
          .where(eq(users.id, payload.userId))
          .limit(1);

        if (user.length && user[0].isActive) {
          req.user = {
            userId: payload.userId,
            username: payload.username,
            email: payload.email,
            role: user[0].role as 'user' | 'admin',
          };
          req.userId = payload.userId;
        }
      } catch (tokenError) {
        // Token is invalid, but we don't return an error for optional auth
        console.warn('Invalid token in optional auth:', tokenError);
      }
    }

    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next(); // Continue without authentication for optional auth
  }
};

export default {
  authenticateToken,
  requireAdmin,
  requireEmailVerification,
  optionalAuth,
};