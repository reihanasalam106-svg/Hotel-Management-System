import { Router } from 'express';
import { housekeepingController } from '../controllers/housekeepingController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

// List tasks (Admin, Manager, Receptionist, Housekeeping, Staff)
router.get('/tasks', requireRole('Admin', 'Manager', 'Receptionist', 'Housekeeping', 'Staff'), housekeepingController.getAllTasks);
router.get('/tasks/:id', requireRole('Admin', 'Manager', 'Receptionist', 'Housekeeping', 'Staff'), housekeepingController.getTaskById);

// Create / Edit task (Admin, Manager, Housekeeping)
router.post('/tasks', requireRole('Admin', 'Manager', 'Housekeeping'), validate({
  taskType: { required: true }
}), housekeepingController.createTask);

router.put('/tasks/:id', requireRole('Admin', 'Manager', 'Housekeeping'), housekeepingController.updateTask);

// Update status (Admin, Manager, Housekeeping, Staff)
router.patch('/tasks/:id/status', requireRole('Admin', 'Manager', 'Housekeeping', 'Staff'), validate({
  status: { required: true }
}), housekeepingController.updateTaskStatus);

// Assign staff (Admin, Manager, Housekeeping)
router.patch('/tasks/:id/assign', requireRole('Admin', 'Manager', 'Housekeeping'), validate({
  assignedStaffId: { required: true }
}), housekeepingController.assignTask);

// Delete task (Admin, Manager)
router.delete('/tasks/:id', requireRole('Admin', 'Manager'), housekeepingController.deleteTask);

export default router;
