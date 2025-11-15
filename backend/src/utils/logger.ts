import fs from 'fs';
import path from 'path';
import env from '@/config/env';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  meta?: any;
  stack?: string;
}

class Logger {
  private logLevel: LogLevel;
  private logFile?: string;
  private logToFile: boolean;

  constructor() {
    this.logLevel = this.getLogLevel(env.LOG_LEVEL);
    this.logToFile = env.NODE_ENV === 'production' || !!env.LOG_FILE;

    if (this.logToFile && env.LOG_FILE) {
      this.logFile = env.LOG_FILE;
      this.ensureLogDirectory();
    }
  }

  private getLogLevel(level: string): LogLevel {
    switch (level.toLowerCase()) {
      case 'error':
        return LogLevel.ERROR;
      case 'warn':
        return LogLevel.WARN;
      case 'info':
        return LogLevel.INFO;
      case 'debug':
        return LogLevel.DEBUG;
      default:
        return LogLevel.INFO;
    }
  }

  private ensureLogDirectory(): void {
    if (this.logFile) {
      const logDir = path.dirname(this.logFile);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
    }
  }

  private formatMessage(level: string, message: string, meta?: any, stack?: string): string {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      ...(meta && { meta }),
      ...(stack && { stack }),
    };

    return JSON.stringify(logEntry);
  }

  private writeToFile(formattedMessage: string): void {
    if (this.logFile && this.logToFile) {
      try {
        fs.appendFileSync(this.logFile, formattedMessage + '\n');
      } catch (error) {
        console.error('Failed to write to log file:', error);
      }
    }
  }

  private writeToConsole(level: string, message: string, meta?: any, stack?: string): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

    switch (level) {
      case 'error':
        console.error(formattedMessage);
        if (meta) {
          console.error('META:', meta);
        }
        if (stack) {
          console.error('STACK:', stack);
        }
        break;
      case 'warn':
        console.warn(formattedMessage);
        if (meta) {
          console.warn('META:', meta);
        }
        break;
      case 'debug':
        if (this.logLevel >= LogLevel.DEBUG) {
          console.debug(formattedMessage);
          if (meta) {
            console.debug('META:', meta);
          }
        }
        break;
      case 'info':
      default:
        if (this.logLevel >= LogLevel.INFO) {
          console.info(formattedMessage);
          if (meta) {
            console.info('META:', meta);
          }
        }
        break;
    }
  }

  private log(level: string, message: string, meta?: any, stack?: string): void {
    const logLevel = this.getLogLevel(level);
    if (logLevel > this.logLevel) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message, meta, stack);

    // Always log to console
    this.writeToConsole(level, message, meta, stack);

    // Write to file if configured
    if (this.logToFile) {
      this.writeToFile(formattedMessage);
    }
  }

  error(message: string, meta?: any, error?: Error): void {
    const stack = error?.stack;
    this.log('error', message, meta, stack);
  }

  warn(message: string, meta?: any): void {
    this.log('warn', message, meta);
  }

  info(message: string, meta?: any): void {
    this.log('info', message, meta);
  }

  debug(message: string, meta?: any): void {
    this.log('debug', message, meta);
  }

  // Structured logging methods
  logRequest(req: any, res: any, responseTime?: number): void {
    const meta = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers?.['user-agent'],
      statusCode: res.statusCode,
      responseTime: responseTime ? `${responseTime}ms` : undefined,
      userId: req.user?.userId,
      username: req.user?.username,
    };

    if (res.statusCode >= 400) {
      this.warn(`HTTP ${res.statusCode} - ${req.method} ${req.originalUrl}`, meta);
    } else {
      this.info(`HTTP ${res.statusCode} - ${req.method} ${req.originalUrl}`, meta);
    }
  }

  logAuth(action: string, userId?: string, ip?: string, userAgent?: string, success: boolean = true): void {
    const meta = {
      action,
      userId,
      ip,
      userAgent,
      success,
      timestamp: new Date().toISOString(),
    };

    if (success) {
      this.info(`Auth: ${action}`, meta);
    } else {
      this.warn(`Auth failed: ${action}`, meta);
    }
  }

  logSubmission(submissionId: string, userId: string, problemId: string, language: string, status: string, executionTime?: number): void {
    const meta = {
      submissionId,
      userId,
      problemId,
      language,
      status,
      executionTime,
      timestamp: new Date().toISOString(),
    };

    this.info(`Submission: ${status}`, meta);
  }

  logCodeExecution(userId: string, language: string, status: string, executionTime?: number): void {
    const meta = {
      userId,
      language,
      status,
      executionTime,
      timestamp: new Date().toISOString(),
    };

    this.info(`Code execution: ${status}`, meta);
  }

  logAdmin(action: string, adminId: string, targetId?: string, details?: any): void {
    const meta = {
      action,
      adminId,
      targetId,
      details,
      timestamp: new Date().toISOString(),
    };

    this.info(`Admin: ${action}`, meta);
  }

  logError(operation: string, error: Error, context?: any): void {
    const meta = {
      operation,
      context,
      name: error.name,
      message: error.message,
      timestamp: new Date().toISOString(),
    };

    this.error(`Operation failed: ${operation}`, meta, error);
  }

  logPerformance(operation: string, duration: number, details?: any): void {
    const meta = {
      operation,
      duration: `${duration}ms`,
      details,
      timestamp: new Date().toISOString(),
    };

    if (duration > 5000) {
      this.warn(`Slow operation: ${operation}`, meta);
    } else {
      this.debug(`Performance: ${operation}`, meta);
    }
  }

  logDatabase(operation: string, table: string, duration?: number, details?: any): void {
    const meta = {
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined,
      details,
      timestamp: new Date().toISOString(),
    };

    this.debug(`Database: ${operation} on ${table}`, meta);
  }
}

// Create and export singleton instance
const logger = new Logger();

export default logger;