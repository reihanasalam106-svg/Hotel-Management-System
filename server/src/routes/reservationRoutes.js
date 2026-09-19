import { Router } from 'express';
import { reservationController } from '../controllers/reservationController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

// Reservation viewing and management (Admin, Manager, Receptionist)
router.get('/', requireRole('Admin', 'Manager', 'Receptionist'), reservationController.getAllReservations);
router.get('/:id', requireRole('Admin', 'Manager', 'Receptionist'), reservationController.getReservationById);

router.post('/', requireRole('Admin', 'Manager', 'Receptionist'), validate({
  checkIn: { required: true, type: 'date' },
  checkOut: { required: true, type: 'date' }
}), reservationController.createReservation);

router.put('/:id', requireRole('Admin', 'Manager', 'Receptionist'), reservationController.updateReservation);

router.patch('/:id/status', requireRole('Admin', 'Manager', 'Receptionist'), reservationController.updateReservationStatus);

// Dedicated Check-In / Check-Out Workflow endpoints
router.post('/:id/check-in', requireRole('Admin', 'Manager', 'Receptionist'), reservationController.checkIn);
router.post('/:id/check-out', requireRole('Admin', 'Manager', 'Receptionist'), reservationController.checkOut);
router.post('/:id/cancel', requireRole('Admin', 'Manager', 'Receptionist'), reservationController.cancelReservation);

// Cancellation / Deletion (Admin, Manager)
router.delete('/:id', requireRole('Admin', 'Manager'), reservationController.deleteReservation);

export default router;
