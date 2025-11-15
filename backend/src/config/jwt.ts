import jwt from 'jsonwebtoken';
import env from './env';

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export class JWTService {
  static generateAccessToken(payload: Omit<JWTPayload, 'role'> & { role?: string }): string {
    return jwt.sign(
      {
        userId: payload.userId,
        username: payload.username,
        email: payload.email,
        role: payload.role || 'user',
      } as JWTPayload,
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );
  }

  static generateRefreshToken(payload: Pick<JWTPayload, 'userId' | 'username'>): string {
    return jwt.sign(
      {
        userId: payload.userId,
        username: payload.username,
        type: 'refresh',
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
    );
  }

  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  static verifyRefreshToken(token: string): { userId: string; username: string } {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }
      return {
        userId: decoded.userId,
        username: decoded.username,
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static generateTokens(payload: Omit<JWTPayload, 'role'> & { role?: string }) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken({
      userId: payload.userId,
      username: payload.username,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

export default JWTService;