import { Router } from 'express';
import { staffController } from '../controllers/staffController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);
router.use(requireRole('Admin', 'Manager'));

router.get('/', staffController.getAllStaff);
router.get('/:id', staffController.getStaffById);

router.post('/', validate({
  name: { required: true },
  email: { required: true, type: 'email' }
}), staffController.createStaff);

router.put('/:id', staffController.updateStaff);

router.patch('/:id/status', validate({
  status: { required: true }
}), staffController.updateStaffStatus);

router.delete('/:id', requireRole('Admin', 'Manager'), staffController.deleteStaff);

export default router;
