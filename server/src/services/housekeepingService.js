import { housekeepingRepository } from '../repositories/housekeepingRepository.js';
import { roomRepository } from '../repositories/roomRepository.js';
import { staffRepository } from '../repositories/staffRepository.js';
import { ApiError } from '../utils/apiError.js';

export const housekeepingService = {
  async getAllTasks(filters) {
    return housekeepingRepository.findAll(filters);
  },

  async getTaskById(id) {
    const task = await housekeepingRepository.findById(id);
    if (!task) {
      throw ApiError.notFound(`Housekeeping task with ID '${id}' not found`);
    }
    return task;
  },

  async createTask(data) {
    if (!data.roomId && !data.roomNumber) {
      throw ApiError.badRequest('Room ID or room number is required for housekeeping tasks');
    }

    if (data.assignedStaffId) {
      const staff = await staffRepository.findById(data.assignedStaffId);
      if (!staff) {
        throw ApiError.badRequest(`Staff with ID '${data.assignedStaffId}' not found`);
      }
    }

    const task = await housekeepingRepository.create(data);

    // Optionally sync housekeeping status on the room
    const room = await roomRepository.findById(data.roomId) || await roomRepository.findByRoomNumber(data.roomNumber);
    if (room && data.status) {
      await roomRepository.updateStatus(room.id, null, data.status);
    }

    return task;
  },

  async updateTask(id, data) {
    const existing = await housekeepingRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Housekeeping task with ID '${id}' not found`);
    }

    if (data.assignedStaffId) {
      const staff = await staffRepository.findById(data.assignedStaffId);
      if (!staff) {
        throw ApiError.badRequest(`Staff with ID '${data.assignedStaffId}' not found`);
      }
    }

    return housekeepingRepository.update(id, data);
  },

  async updateTaskStatus(id, status) {
    const existing = await housekeepingRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Housekeeping task with ID '${id}' not found`);
    }

    const validStatuses = ['Ready', 'Cleaning Required', 'Cleaning In Progress', 'Cleaned', 'Maintenance'];
    if (!validStatuses.includes(status)) {
      throw ApiError.badRequest(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    const updated = await housekeepingRepository.updateStatus(id, status);

    // Sync room housekeeping status
    const room = await roomRepository.findById(existing.roomId) || await roomRepository.findByRoomNumber(existing.roomNumber);
    if (room) {
      await roomRepository.updateStatus(room.id, null, status);
    }

    return updated;
  },

  async assignTask(id, assignedStaffId) {
    const existing = await housekeepingRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Housekeeping task with ID '${id}' not found`);
    }

    if (assignedStaffId) {
      const staff = await staffRepository.findById(assignedStaffId);
      if (!staff) {
        throw ApiError.badRequest(`Staff with ID '${assignedStaffId}' not found`);
      }
    }

    return housekeepingRepository.assignStaff(id, assignedStaffId);
  },

  async deleteTask(id) {
    const existing = await housekeepingRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Housekeeping task with ID '${id}' not found`);
    }

    return housekeepingRepository.delete(id);
  }
};
