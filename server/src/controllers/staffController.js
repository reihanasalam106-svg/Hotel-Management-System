import { staffService } from '../services/staffService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const staffController = {
  async getAllStaff(req, res, next) {
    try {
      const staffList = await staffService.getAllStaff(req.query);
      return sendSuccess(res, 'Staff members retrieved successfully', staffList);
    } catch (err) {
      next(err);
    }
  },

  async getStaffById(req, res, next) {
    try {
      const staff = await staffService.getStaffById(req.params.id);
      return sendSuccess(res, 'Staff member retrieved successfully', staff);
    } catch (err) {
      next(err);
    }
  },

  async createStaff(req, res, next) {
    try {
      const staff = await staffService.createStaff(req.body);
      return sendSuccess(res, 'Staff member created successfully', staff, 201);
    } catch (err) {
      next(err);
    }
  },

  async updateStaff(req, res, next) {
    try {
      const staff = await staffService.updateStaff(req.params.id, req.body);
      return sendSuccess(res, 'Staff member updated successfully', staff);
    } catch (err) {
      next(err);
    }
  },

  async updateStaffStatus(req, res, next) {
    try {
      const { status } = req.body;
      const staff = await staffService.updateStaffStatus(req.params.id, status);
      return sendSuccess(res, 'Staff status updated successfully', staff);
    } catch (err) {
      next(err);
    }
  },

  async deleteStaff(req, res, next) {
    try {
      await staffService.deleteStaff(req.params.id);
      return sendSuccess(res, 'Staff member deleted successfully', { id: req.params.id });
    } catch (err) {
      next(err);
    }
  }
};
