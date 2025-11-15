import { Router } from 'express';
import authRoutes from './auth';

const router = Router();

// Health check for API
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      redis: 'disconnected', // Will be implemented if Redis is added
      judge0: process.env.JUDGE0_API_KEY ? 'configured' : 'not_configured',
    },
  });
});

// API test endpoint
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString(),
    data: {
      environment: process.env.NODE_ENV || 'unknown',
      port: process.env.PORT || 3000,
      apiVersion: process.env.API_VERSION || 'v1',
    },
  });
});

// Mount authentication routes
router.use('/auth', authRoutes);

// TODO: Add other routes
// router.use('/users', userRoutes);
// router.use('/problems', problemRoutes);
// router.use('/submissions', submissionRoutes);
// router.use('/leaderboard', leaderboardRoutes);
// router.use('/achievements', achievementRoutes);
// router.use('/admin', adminRoutes);

export default router;