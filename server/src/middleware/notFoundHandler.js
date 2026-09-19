import { ApiError } from '../utils/apiError.js';

export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Resource not found - ${req.method} ${req.originalUrl}`));
};
