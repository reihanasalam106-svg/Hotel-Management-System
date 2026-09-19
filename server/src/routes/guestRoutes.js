import { Router } from 'express';
import { guestController } from '../controllers/guestController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);
router.use(requireRole('Admin', 'Manager', 'Receptionist'));

router.get('/', guestController.getAllGuests);
router.get('/:id', guestController.getGuestById);

router.post('/', validate({
  name: { required: true },
  phone: { required: true },
  email: { required: true, type: 'email' }
}), guestController.createGuest);

router.put('/:id', guestController.updateGuest);

router.patch('/:id/status', guestController.updateGuestStatus);

router.delete('/:id', requireRole('Admin', 'Manager'), guestController.deleteGuest);

export default router;
