import { guestService } from '../services/guestService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const guestController = {
  async getAllGuests(req, res, next) {
    try {
      const guests = await guestService.getAllGuests(req.query);
      return sendSuccess(res, 'Guests retrieved successfully', guests);
    } catch (err) {
      next(err);
    }
  },

  async getGuestById(req, res, next) {
    try {
      const guest = await guestService.getGuestById(req.params.id);
      return sendSuccess(res, 'Guest retrieved successfully', guest);
    } catch (err) {
      next(err);
    }
  },

  async createGuest(req, res, next) {
    try {
      const guest = await guestService.createGuest(req.body);
      return sendSuccess(res, 'Guest created successfully', guest, 201);
    } catch (err) {
      next(err);
    }
  },

  async updateGuest(req, res, next) {
    try {
      const guest = await guestService.updateGuest(req.params.id, req.body);
      return sendSuccess(res, 'Guest updated successfully', guest);
    } catch (err) {
      next(err);
    }
  },

  async updateGuestStatus(req, res, next) {
    try {
      const { status } = req.body;
      const guest = await guestService.updateGuestStatus(req.params.id, status);
      return sendSuccess(res, 'Guest status updated successfully', guest);
    } catch (err) {
      next(err);
    }
  },

  async deleteGuest(req, res, next) {
    try {
      await guestService.deleteGuest(req.params.id);
      return sendSuccess(res, 'Guest deleted successfully', { id: req.params.id });
    } catch (err) {
      next(err);
    }
  }
};
