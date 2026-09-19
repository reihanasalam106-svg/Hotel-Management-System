import { reportService } from '../services/reportService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const reportController = {
  async getSummary(req, res, next) {
    try {
      const summary = await reportService.getSummary(req.query);
      return sendSuccess(res, 'Reports summary retrieved successfully', summary);
    } catch (err) {
      next(err);
    }
  }
};
