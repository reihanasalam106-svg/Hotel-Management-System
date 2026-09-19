import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// View dashboard summary (Admin, Manager, Receptionist)
router.get('/summary', requireRole('Admin', 'Manager', 'Receptionist'), dashboardController.getSummary);

export default router;
