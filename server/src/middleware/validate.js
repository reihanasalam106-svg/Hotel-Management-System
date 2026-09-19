import { ApiError } from '../utils/apiError.js';

/**
 * Validates request fields against a validation schema definition.
 * @param {Object} schema
 * @param {'body'|'query'|'params'} source
 */
export const validate = (schema, source = 'body') => {
  return (req, _res, next) => {
    const data = req[source] || {};
    const errors = {};

    for (const [field, rules] of Object.entries(schema)) {
      const val = data[field];

      if (rules.required && (val === undefined || val === null || val === '')) {
        errors[field] = `${field} is required`;
        continue;
      }

      if (val !== undefined && val !== null && val !== '') {
        if (rules.type === 'number') {
          const num = Number(val);
          if (isNaN(num)) {
            errors[field] = `${field} must be a valid number`;
          } else if (rules.min !== undefined && num < rules.min) {
            errors[field] = `${field} must be greater than or equal to ${rules.min}`;
          } else if (rules.max !== undefined && num > rules.max) {
            errors[field] = `${field} must be less than or equal to ${rules.max}`;
          }
        }

        if (rules.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(String(val))) {
            errors[field] = `${field} must be a valid email address`;
          }
        }

        if (rules.type === 'date') {
          const date = new Date(val);
          if (isNaN(date.getTime())) {
            errors[field] = `${field} must be a valid date`;
          }
        }

        if (rules.enum && !rules.enum.includes(val)) {
          errors[field] = `${field} must be one of: ${rules.enum.join(', ')}`;
        }

        if (rules.custom && typeof rules.custom === 'function') {
          const customError = rules.custom(val, data);
          if (customError) {
            errors[field] = customError;
          }
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return next(ApiError.badRequest('Validation failed', errors));
    }

    next();
  };
};
