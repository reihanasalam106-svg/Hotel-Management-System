import { Router } from 'express';
import { roomController } from '../controllers/roomController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// Protect all room endpoints with authentication
router.use(authenticate);

// Read rooms (accessible to all active staff roles)
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);

// Create / Update Room (Admin, Manager)
router.post('/', requireRole('Admin', 'Manager'), validate({
  roomNumber: { required: true },
  pricePerNight: { type: 'number', min: 0 }
}), roomController.createRoom);

router.put('/:id', requireRole('Admin', 'Manager'), roomController.updateRoom);

// Update status (Admin, Manager, Receptionist, Housekeeping)
router.patch('/:id/status', requireRole('Admin', 'Manager', 'Receptionist', 'Housekeeping'), roomController.updateRoomStatus);

// Delete room (Admin only)
router.delete('/:id', requireRole('Admin'), roomController.deleteRoom);

export default router;
