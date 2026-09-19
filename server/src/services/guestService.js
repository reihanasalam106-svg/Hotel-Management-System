import { guestRepository } from '../repositories/guestRepository.js';
import { query } from '../config/database.js';
import { ApiError } from '../utils/apiError.js';

export const guestService = {
  async getAllGuests(params) {
    return guestRepository.findAll(params);
  },

  async getGuestById(id) {
    const guest = await guestRepository.findById(id);
    if (!guest) {
      throw ApiError.notFound(`Guest with ID '${id}' not found`);
    }
    return guest;
  },

  async createGuest(data) {
    if (!data.name || !data.phone || !data.email) {
      throw ApiError.badRequest('Name, phone, and email are required fields');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw ApiError.badRequest('Invalid email format');
    }

    return guestRepository.create(data);
  },

  async updateGuest(id, data) {
    const existing = await guestRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Guest with ID '${id}' not found`);
    }

    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw ApiError.badRequest('Invalid email format');
      }
    }

    return guestRepository.update(id, data);
  },

  async updateGuestStatus(id, status) {
    const existing = await guestRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Guest with ID '${id}' not found`);
    }

    const validStatuses = ['In House', 'Upcoming', 'Checked Out', 'Inactive', 'Active'];
    if (status && !validStatuses.includes(status)) {
      throw ApiError.badRequest(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    return guestRepository.updateStatus(id, status);
  },

  async deleteGuest(id) {
    const existing = await guestRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Guest with ID '${id}' not found`);
    }

    const resCheck = await query('SELECT COUNT(*) as cnt FROM reservations WHERE guest_id = $1', [existing.id]);
    const invCheck = await query('SELECT COUNT(*) as cnt FROM invoices WHERE guest_id = $1', [existing.id]);

    const resCount = parseInt(resCheck.rows[0]?.cnt || '0', 10);
    const invCount = parseInt(invCheck.rows[0]?.cnt || '0', 10);

    if (resCount > 0 || invCount > 0) {
      throw ApiError.badRequest(`Cannot delete guest '${existing.name}' with existing reservations (${resCount}) or billing invoices (${invCount})`);
    }

    return guestRepository.delete(id);
  }
};
