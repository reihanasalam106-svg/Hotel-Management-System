import { authService } from '../services/authService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const authController = {
  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      return sendSuccess(res, 'Login successful', result, 200);
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res, next) {
    try {
      const result = await authService.logout();
      return sendSuccess(res, 'Logout successful', result, 200);
    } catch (err) {
      next(err);
    }
  },

  async getMe(req, res, next) {
    try {
      const result = await authService.getCurrentUser(req.user.id);
      return sendSuccess(res, 'User profile retrieved successfully', result.user, 200);
    } catch (err) {
      next(err);
    }
  }
};

export default authController;
