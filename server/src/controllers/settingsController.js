import { settingsService } from '../services/settingsService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const settingsController = {
  async getSettings(req, res, next) {
    try {
      const settings = await settingsService.getSettings();
      return sendSuccess(res, 'Settings retrieved successfully', settings);
    } catch (err) {
      next(err);
    }
  },

  async updateSettings(req, res, next) {
    try {
      const settings = await settingsService.updateSettings(req.body);
      return sendSuccess(res, 'Settings updated successfully', settings);
    } catch (err) {
      next(err);
    }
  }
};
