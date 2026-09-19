import { Router } from 'express';
import { settingsController } from '../controllers/settingsController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// View settings (Admin, Manager, Receptionist)
router.get('/', requireRole('Admin', 'Manager', 'Receptionist'), settingsController.getSettings);

// Update settings (Admin, Manager only)
router.put('/', requireRole('Admin', 'Manager'), settingsController.updateSettings);

export default router;
