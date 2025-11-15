import { db } from '@/config/database';
import { users, userSessions } from '@/models/schema';
import { eq, and, gt } from 'drizzle-orm';
import { JWTService } from '@/config/jwt';
import { EncryptionService } from '@/utils/encryption';
import { createError, notFoundError, authenticationError } from '@/middleware/errorHandler';
import logger from '@/utils/logger';
import env from '@/config/env';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginData {
  email: string;
  password: string;
  userAgent?: string;
  ipAddress?: string;
}

export const authService = {
  async register(data: RegisterData) {
    const { username, email, password, firstName, lastName } = data;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw createError('User with this email already exists', 409, 'EMAIL_EXISTS');
    }

    const existingUsername = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUsername.length > 0) {
      throw createError('Username already taken', 409, 'USERNAME_EXISTS');
    }

    // Hash password
    const hashedPassword = await EncryptionService.hashPassword(password);

    // Generate email verification token
    const emailVerificationToken = EncryptionService.generateEmailVerificationToken();

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        emailVerificationToken,
        isActive: true,
        isEmailVerified: false,
      })
      .returning();

    // TODO: Send verification email (mocked for now)
    if (!env.MOCK_EMAIL) {
      logger.info('Email verification token generated', {
        userId: newUser.id,
        token: emailVerificationToken,
      });
    } else {
      logger.info('Mock: Email verification would be sent', {
        userId: newUser.id,
        email: newUser.email,
        verificationToken: emailVerificationToken,
      });
    }

    return {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
      },
    };
  },

  async login(data: LoginData) {
    const { email, password, userAgent, ipAddress } = data;

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.isActive, true)))
      .limit(1);

    if (!user.length) {
      logger.warn('Login attempt with non-existent email', { email, ipAddress });
      throw authenticationError('Invalid email or password');
    }

    const userData = user[0];

    // Check password
    const isPasswordValid = await EncryptionService.comparePassword(password, userData.password);

    if (!isPasswordValid) {
      logger.warn('Login attempt with invalid password', {
        userId: userData.id,
        email,
        ipAddress,
      });
      throw authenticationError('Invalid email or password');
    }

    // Generate tokens
    const tokens = JWTService.generateTokens({
      userId: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
    });

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await db.insert(userSessions).values({
      userId: userData.id,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userAgent,
      ipAddress,
      expiresAt,
      isActive: true,
    });

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, userData.id));

    return {
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        isEmailVerified: userData.isEmailVerified,
      },
      tokens,
    };
  },

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw authenticationError('Refresh token is required');
    }

    // Verify refresh token
    const payload = JWTService.verifyRefreshToken(refreshToken);

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.id, payload.userId), eq(users.isActive, true)))
      .limit(1);

    if (!user.length) {
      throw authenticationError('Invalid refresh token');
    }

    const userData = user[0];

    // Check if refresh token exists and is valid
    const session = await db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.userId, userData.id),
          eq(userSessions.refreshToken, refreshToken),
          eq(userSessions.isActive, true),
          gt(userSessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!session.length) {
      throw authenticationError('Invalid or expired refresh token');
    }

    // Generate new tokens
    const newTokens = JWTService.generateTokens({
      userId: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
    });

    // Update session
    await db
      .update(userSessions)
      .set({
        token: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      })
      .where(eq(userSessions.id, session[0].id));

    return newTokens;
  },

  async logout(accessToken?: string, refreshToken?: string) {
    try {
      if (refreshToken) {
        // Invalidate session by refresh token
        await db
          .update(userSessions)
          .set({ isActive: false })
          .where(eq(userSessions.refreshToken, refreshToken));
      }

      if (accessToken) {
        // Invalidate session by access token
        await db
          .update(userSessions)
          .set({ isActive: false })
          .where(eq(userSessions.token, accessToken));
      }
    } catch (error) {
      logger.error('Error during logout', { error, accessToken, refreshToken });
    }
  },

  async forgotPassword(email: string) {
    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.isActive, true)))
      .limit(1);

    if (!user.length) {
      // Don't reveal if user exists or not for security
      logger.info('Password reset requested for non-existent email', { email });
      return;
    }

    const userData = user[0];

    // Generate reset token
    const resetToken = EncryptionService.generatePasswordResetToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    // Update user with reset token
    await db
      .update(users)
      .set({
        passwordResetToken: resetToken,
        passwordResetExpires: expiresAt,
      })
      .where(eq(users.id, userData.id));

    // TODO: Send password reset email (mocked for now)
    if (!env.MOCK_EMAIL) {
      logger.info('Password reset token generated', {
        userId: userData.id,
        token: resetToken,
      });
    } else {
      logger.info('Mock: Password reset email would be sent', {
        userId: userData.id,
        email: userData.email,
        resetToken,
      });
    }
  },

  async resetPassword(token: string, newPassword: string) {
    // Find user with valid reset token
    const user = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.passwordResetToken, token),
          gt(users.passwordResetExpires!, new Date()),
          eq(users.isActive, true)
        )
      )
      .limit(1);

    if (!user.length) {
      throw createError('Invalid or expired reset token', 400, 'INVALID_RESET_TOKEN');
    }

    const userData = user[0];

    // Hash new password
    const hashedPassword = await EncryptionService.hashPassword(newPassword);

    // Update password and clear reset token
    await db
      .update(users)
      .set({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      })
      .where(eq(users.id, userData.id));

    // Invalidate all user sessions
    await db
      .update(userSessions)
      .set({ isActive: false })
      .where(eq(userSessions.userId, userData.id));

    logger.info('Password reset successful', { userId: userData.id });
  },

  async verifyEmail(token: string) {
    const user = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.emailVerificationToken, token),
          eq(users.isActive, true)
        )
      )
      .limit(1);

    if (!user.length) {
      throw createError('Invalid verification token', 400, 'INVALID_VERIFICATION_TOKEN');
    }

    const userData = user[0];

    if (userData.isEmailVerified) {
      throw createError('Email already verified', 400, 'EMAIL_ALREADY_VERIFIED');
    }

    // Update user
    await db
      .update(users)
      .set({
        isEmailVerified: true,
        emailVerificationToken: null,
      })
      .where(eq(users.id, userData.id));

    logger.info('Email verified successfully', { userId: userData.id });
  },

  async resendVerification(email: string) {
    const user = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.email, email),
          eq(users.isActive, true),
          eq(users.isEmailVerified, false)
        )
      )
      .limit(1);

    if (!user.length) {
      // Don't reveal if user exists or not for security
      return;
    }

    const userData = user[0];

    // Generate new verification token
    const verificationToken = EncryptionService.generateEmailVerificationToken();

    await db
      .update(users)
      .set({ emailVerificationToken: verificationToken })
      .where(eq(users.id, userData.id));

    // TODO: Send verification email (mocked for now)
    if (!env.MOCK_EMAIL) {
      logger.info('Email verification token regenerated', {
        userId: userData.id,
        token: verificationToken,
      });
    } else {
      logger.info('Mock: Verification email would be resent', {
        userId: userData.id,
        email: userData.email,
        verificationToken,
      });
    }
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      throw notFoundError('User not found');
    }

    const userData = user[0];

    // Verify current password
    const isCurrentPasswordValid = await EncryptionService.comparePassword(
      currentPassword,
      userData.password
    );

    if (!isCurrentPasswordValid) {
      throw authenticationError('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await EncryptionService.hashPassword(newPassword);

    // Update password
    await db
      .update(users)
      .set({ password: hashedNewPassword })
      .where(eq(users.id, userData.id));

    // Invalidate all user sessions (force re-login)
    await db
      .update(userSessions)
      .set({ isActive: false })
      .where(eq(userSessions.userId, userData.id));

    logger.info('Password changed successfully', { userId });
  },

  async getMe(userId: string) {
    const user = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        avatar: users.avatar,
        bio: users.bio,
        role: users.role,
        isEmailVerified: users.isEmailVerified,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      throw notFoundError('User not found');
    }

    return user[0];
  },
};

