import { config } from '../config/index.js';
import { ApiError } from '../utils/apiError.js';
import { sendError } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, _next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorDetails = {};

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = err.details || {};
  } else if (err.name === 'SyntaxError' && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON in request body';
    errorDetails = { reason: 'Invalid JSON payload' };
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message || 'Validation failed';
    errorDetails = err.errors || {};
  } else if (err.message) {
    message = config.isProd ? 'Something went wrong' : err.message;
  }

  // Add stack trace only in development mode if applicable and not operational
  if (config.isDev && !err.isOperational && err.stack) {
    errorDetails = {
      ...errorDetails,
      stack: err.stack
    };
  }

  return sendError(res, message, errorDetails, statusCode);
};
