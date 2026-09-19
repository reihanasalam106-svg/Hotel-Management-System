import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { userRepository } from '../repositories/userRepository.js';
import { ApiError } from '../utils/apiError.js';

export const authService = {
  /**
   * Authenticate user with email and password, returning a signed JWT
   * @param {{ email?: string, username?: string, password?: string }} credentials
   */
  async login(credentials) {
    const email = credentials.email || credentials.username;
    const password = credentials.password;

    if (!email || !password) {
      throw ApiError.badRequest('Email and password are required');
    }

    const user = await userRepository.findByEmail(email.trim());
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (user.status !== 'Active') {
      throw ApiError.forbidden('Your account is currently inactive. Contact an administrator.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Generate signed JWT with configured expiration
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Sanitize user object (never expose password_hash)
    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };

    return {
      user: sanitizedUser,
      token,
      expiresIn: config.jwt.expiresIn
    };
  },

  /**
   * Logout session (client clears Bearer token)
   */
  async logout() {
    return {
      message: 'Logged out successfully'
    };
  },

  /**
   * Retrieve current authenticated user profile
   * @param {number|string} userId
   */
  async getCurrentUser(userId) {
    if (!userId) {
      throw ApiError.unauthorized('User ID is required');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }
};

export default authService;
