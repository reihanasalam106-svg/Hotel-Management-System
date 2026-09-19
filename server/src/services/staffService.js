import { staffRepository } from '../repositories/staffRepository.js';
import { ApiError } from '../utils/apiError.js';

export const staffService = {
  async getAllStaff(filters) {
    return staffRepository.findAll(filters);
  },

  async getStaffById(id) {
    const staff = await staffRepository.findById(id);
    if (!staff) {
      throw ApiError.notFound(`Staff with ID '${id}' not found`);
    }
    return staff;
  },

  async createStaff(data) {
    if (!data.name || !data.email) {
      throw ApiError.badRequest('Staff name and email are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw ApiError.badRequest('Invalid email address');
    }

    const existing = await staffRepository.findByEmail(data.email);
    if (existing) {
      throw ApiError.conflict(`Staff member with email '${data.email}' already exists`);
    }

    return staffRepository.create(data);
  },

  async updateStaff(id, data) {
    const existing = await staffRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Staff with ID '${id}' not found`);
    }

    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw ApiError.badRequest('Invalid email address');
      }
    }

    return staffRepository.update(id, data);
  },

  async updateStaffStatus(id, status) {
    const existing = await staffRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Staff with ID '${id}' not found`);
    }

    const validStatuses = ['Active', 'On Duty', 'Off Duty', 'On Leave', 'Inactive'];
    if (!validStatuses.includes(status)) {
      throw ApiError.badRequest(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    return staffRepository.updateStatus(id, status);
  },

  async deleteStaff(id) {
    const existing = await staffRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Staff with ID '${id}' not found`);
    }

    return staffRepository.delete(id);
  }
};
