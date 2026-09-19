import { Router } from 'express';
import { testConnection } from '../config/database.js';
import authRoutes from './authRoutes.js';
import roomRoutes from './roomRoutes.js';
import guestRoutes from './guestRoutes.js';
import reservationRoutes from './reservationRoutes.js';
import housekeepingRoutes from './housekeepingRoutes.js';
import billingRoutes from './billingRoutes.js';
import staffRoutes from './staffRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import reportRoutes from './reportRoutes.js';

const router = Router();

// Health check endpoint with Database Status (Section 7)
router.get('/health', async (_req, res) => {
  const dbStatus = await testConnection();

  if (dbStatus.connected) {
    return res.status(200).json({
      success: true,
      message: 'API is healthy',
      data: {
        server: 'ok',
        database: 'connected',
        dbName: dbStatus.database,
        timestamp: dbStatus.timestamp
      }
    });
  } else {
    return res.status(503).json({
      success: false,
      message: 'API is running with database connectivity issues',
      data: {
        server: 'ok',
        database: 'disconnected',
        error: dbStatus.message
      }
    });
  }
});

// Module routes
router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/guests', guestRoutes);
router.use('/reservations', reservationRoutes);
router.use('/housekeeping', housekeepingRoutes);
router.use('/billing', billingRoutes);
router.use('/staff', staffRoutes);
router.use('/settings', settingsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);

export default router;
