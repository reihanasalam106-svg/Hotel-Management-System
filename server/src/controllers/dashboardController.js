import { dashboardService } from '../services/dashboardService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const dashboardController = {
  async getSummary(req, res, next) {
    try {
      const summary = await dashboardService.getSummary();
      return sendSuccess(res, 'Dashboard summary retrieved successfully', summary);
    } catch (err) {
      next(err);
    }
  }
};
