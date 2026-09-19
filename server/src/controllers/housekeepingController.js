import { housekeepingService } from '../services/housekeepingService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const housekeepingController = {
  async getAllTasks(req, res, next) {
    try {
      const tasks = await housekeepingService.getAllTasks(req.query);
      return sendSuccess(res, 'Housekeeping tasks retrieved successfully', tasks);
    } catch (err) {
      next(err);
    }
  },

  async getTaskById(req, res, next) {
    try {
      const task = await housekeepingService.getTaskById(req.params.id);
      return sendSuccess(res, 'Housekeeping task retrieved successfully', task);
    } catch (err) {
      next(err);
    }
  },

  async createTask(req, res, next) {
    try {
      const task = await housekeepingService.createTask(req.body);
      return sendSuccess(res, 'Housekeeping task created successfully', task, 201);
    } catch (err) {
      next(err);
    }
  },

  async updateTask(req, res, next) {
    try {
      const task = await housekeepingService.updateTask(req.params.id, req.body);
      return sendSuccess(res, 'Housekeeping task updated successfully', task);
    } catch (err) {
      next(err);
    }
  },

  async updateTaskStatus(req, res, next) {
    try {
      const { status } = req.body;
      const task = await housekeepingService.updateTaskStatus(req.params.id, status);
      return sendSuccess(res, 'Housekeeping task status updated successfully', task);
    } catch (err) {
      next(err);
    }
  },

  async assignTask(req, res, next) {
    try {
      const { assignedStaffId } = req.body;
      const task = await housekeepingService.assignTask(req.params.id, assignedStaffId);
      return sendSuccess(res, 'Housekeeping task assigned successfully', task);
    } catch (err) {
      next(err);
    }
  },

  async deleteTask(req, res, next) {
    try {
      await housekeepingService.deleteTask(req.params.id);
      return sendSuccess(res, 'Housekeeping task deleted successfully', { id: req.params.id });
    } catch (err) {
      next(err);
    }
  }
};
