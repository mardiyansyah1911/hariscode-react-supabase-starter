import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import env from '@/config/env';

export class EncryptionService {
  // Password hashing
  static async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(env.BCRYPT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error('Failed to hash password');
    }
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error('Failed to compare password');
    }
  }

  // Token generation
  static generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  static generateEmailVerificationToken(): string {
    return this.generateToken(16);
  }

  static generatePasswordResetToken(): string {
    return this.generateToken(32);
  }

  static generateApiKey(): string {
    return crypto.randomBytes(24).toString('hex');
  }

  static generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Hashing for sensitive data
  static hashSha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static hashSha512(data: string): string {
    return crypto.createHash('sha512').update(data).digest('hex');
  }

  // Generate unique identifiers
  static generateUUID(): string {
    return crypto.randomUUID();
  }

  static generateShortId(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Code similarity hashing (for anti-cheating)
  static generateCodeHash(code: string): string {
    // Normalize code by removing whitespace and comments
    const normalizedCode = code
      .replace(/\s+/g, ' ')           // Replace multiple whitespaces with single space
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .replace(/\/\/.*$/gm, '')        // Remove single-line comments
      .trim();

    return this.hashSha256(normalizedCode);
  }

  // Generate fingerprint for code submissions (anti-cheating)
  static generateCodeFingerprint(code: string, language: string): string {
    const normalizedCode = code
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/["']/g, '"')           // Normalize quotes
      .replace(/,\s*/g, ',')           // Normalize comma spacing
      .trim();

    const data = `${normalizedCode}:${language}`;
    return this.hashSha512(data);
  }

  // File integrity checking
  static generateFileHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  // Secure random string generation
  static generateSecureRandomString(length: number = 32, chars?: string): string {
    const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const characterSet = chars || defaultChars;
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, characterSet.length);
      result += characterSet.charAt(randomIndex);
    }

    return result;
  }

  // Password strength validation
  static calculatePasswordStrength(password: string): {
    score: number;
    feedback: string[];
    isStrong: boolean;
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 20;
    } else {
      feedback.push('Password should be at least 8 characters long');
    }

    if (password.length >= 12) {
      score += 10;
    }

    // Character variety checks
    if (/[a-z]/.test(password)) {
      score += 10;
    } else {
      feedback.push('Include lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
      score += 10;
    } else {
      feedback.push('Include uppercase letters');
    }

    if (/\d/.test(password)) {
      score += 10;
    } else {
      feedback.push('Include numbers');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 15;
    } else {
      feedback.push('Include special characters');
    }

    // Pattern checks
    if (!/(.)\1{2,}/.test(password)) {
      score += 15; // No repeated characters
    } else {
      feedback.push('Avoid repeating characters');
    }

    if (!/^[a-zA-Z]+$/.test(password) && !/^[0-9]+$/.test(password)) {
      score += 10; // Not all letters or all numbers
    } else {
      feedback.push('Mix letters and numbers');
    }

    // Common patterns check
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /admin/i,
      /letmein/i,
    ];

    let hasCommonPattern = false;
    for (const pattern of commonPatterns) {
      if (pattern.test(password)) {
        hasCommonPattern = true;
        break;
      }
    }

    if (!hasCommonPattern) {
      score += 10;
    } else {
      feedback.push('Avoid common password patterns');
    }

    const isStrong = score >= 70;

    return {
      score: Math.min(score, 100),
      feedback,
      isStrong,
    };
  }

  // Generate secure verification code
  static generateVerificationCode(length: number = 6): string {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += digits.charAt(crypto.randomInt(0, digits.length));
    }
    return code;
  }

  // Obfuscate sensitive data for logging
  static obfuscateEmail(email: string): string {
    const [username, domain] = email.split('@');
    if (username.length <= 2) {
      return `${username[0]}***@${domain}`;
    }
    return `${username.slice(0, 2)}***@${domain}`;
  }

  static obfuscateToken(token: string, visibleChars: number = 8): string {
    if (token.length <= visibleChars) {
      return '*'.repeat(token.length);
    }
    return `${token.slice(0, visibleChars)}${'*'.repeat(token.length - visibleChars)}`;
  }

  static obfuscateApiKey(apiKey: string): string {
    if (apiKey.length <= 16) {
      return '*'.repeat(apiKey.length);
    }
    return `${apiKey.slice(0, 8)}${'*'.repeat(apiKey.length - 16)}${apiKey.slice(-8)}`;
  }

  // HMAC for API integrity
  static generateHMAC(data: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  static verifyHMAC(data: string, hmac: string, secret: string): boolean {
    const expectedHMAC = this.generateHMAC(data, secret);
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHMAC));
  }

  // Time-based one-time password (TOTP) - for future 2FA implementation
  static generateTOTPSecret(): string {
    const buffer = crypto.randomBytes(20);
    return buffer.toString('base64').replace(/=/g, '');
  }

  static generateTOTPCode(secret: string, window: number = 30): string {
    const time = Math.floor(Date.now() / 1000 / window);
    const buffer = Buffer.alloc(8);
    buffer.writeBigUInt64BE(BigInt(time), 0);

    const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base64'));
    hmac.update(buffer);
    const hash = hmac.digest();

    const offset = hash[hash.length - 1] & 0x0f;
    const binary =
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff);

    const code = (binary % 1000000).toString();
    return code.padStart(6, '0');
  }
}

export default EncryptionService;