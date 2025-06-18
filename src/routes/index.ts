import { Router } from 'express';
import articleRoutes from './articleRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.use('/news', articleRoutes);
router.use('/auth', authRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'News API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;