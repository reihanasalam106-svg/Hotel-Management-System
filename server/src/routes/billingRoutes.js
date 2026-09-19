import { Router } from 'express';
import { billingController } from '../controllers/billingController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

// View and manage invoices (Admin, Manager, Receptionist)
router.get('/', requireRole('Admin', 'Manager', 'Receptionist'), billingController.getAllInvoices);
router.get('/:id', requireRole('Admin', 'Manager', 'Receptionist'), billingController.getInvoiceById);

router.post('/', requireRole('Admin', 'Manager', 'Receptionist'), validate({
  nights: { type: 'number', min: 1 },
  roomRate: { type: 'number', min: 0 }
}), billingController.createInvoice);

router.put('/:id', requireRole('Admin', 'Manager', 'Receptionist'), billingController.updateInvoice);

// Record payment (Admin, Manager, Receptionist)
router.post('/:id/payments', requireRole('Admin', 'Manager', 'Receptionist'), validate({
  amount: { required: true, type: 'number', min: 0.01 }
}), billingController.addPayment);

router.patch('/:id/status', requireRole('Admin', 'Manager', 'Receptionist'), billingController.updateInvoiceStatus);

// Cancel invoice (Admin, Manager)
router.post('/:id/cancel', requireRole('Admin', 'Manager'), billingController.cancelInvoice);

// Delete invoice (Admin)
router.delete('/:id', requireRole('Admin'), billingController.deleteInvoice);

export default router;
