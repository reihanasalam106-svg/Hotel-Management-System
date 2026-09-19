import { Router } from 'express';
import { reportController } from '../controllers/reportController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// View reports summary (Admin, Manager only)
router.get('/summary', requireRole('Admin', 'Manager'), reportController.getSummary);

export default router;
