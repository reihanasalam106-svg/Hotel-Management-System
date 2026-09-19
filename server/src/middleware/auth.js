import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { userRepository } from '../repositories/userRepository.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Authentication Middleware
 * Validates JWT bearer token from Authorization header and attaches req.user
 */
export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Authentication token is required (Format: Bearer <token>)');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Authentication token is missing');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw ApiError.unauthorized('Authentication token has expired. Please log in again.');
      }
      throw ApiError.unauthorized('Invalid authentication token');
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw ApiError.unauthorized('User account associated with token no longer exists');
    }

    if (user.status !== 'Active') {
      throw ApiError.forbidden('Your account is currently inactive. Contact an administrator.');
    }

    // Attach sanitized user info to request (strictly no password hash)
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Role-Based Access Control (RBAC) Middleware
 * @param {...string} allowedRoles - Allowed roles (e.g. 'Admin', 'Manager', 'Receptionist')
 */
export const requireRole = (...allowedRoles) => {
  const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

  return (req, _res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    const userRole = (req.user.role || '').toLowerCase();

    // Admin always has full access
    if (userRole === 'admin') {
      return next();
    }

    if (!normalizedAllowed.includes(userRole)) {
      return next(ApiError.forbidden(`Access forbidden: Role '${req.user.role}' lacks permission for this action`));
    }

    next();
  };
};

export const authorize = requireRole;

export default {
  authenticate,
  requireRole,
  authorize
};
