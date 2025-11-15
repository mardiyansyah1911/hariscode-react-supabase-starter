import http from 'http';
import app from './app';
import env from '@/config/env';
import logger from '@/utils/logger';

// Create HTTP server
const server = http.createServer(app);

// Handle graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}, starting graceful shutdown...`);

  server.close((err) => {
    if (err) {
      logger.error('Error during server shutdown', { error: err });
      process.exit(1);
    }

    logger.info('Server closed successfully');
    process.exit(0);
  });

  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

// Handle process signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error, stack: error.stack });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});

// Start server
const PORT = env.PORT;
server.listen(PORT, () => {
  logger.info(`Server started successfully`, {
    port: PORT,
    environment: env.NODE_ENV,
    processId: process.pid,
    nodeVersion: process.version,
    apiVersion: env.API_VERSION,
  });

  logger.info(`🚀 Haris Code API Server is running on port ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`🔗 API endpoint: http://localhost:${PORT}/api/health`);

  if (env.NODE_ENV === 'development') {
    logger.info(`🛠️  Development mode - Debug logging enabled`);
  }
});

// Export server for testing purposes
export default server;