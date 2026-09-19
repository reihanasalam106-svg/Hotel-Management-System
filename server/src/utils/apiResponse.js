/**
 * Standard API Success Response
 * @param {import('express').Response} res - Express response object
 * @param {string} message - Human-readable success message
 * @param {*} data - Response payload
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = (res, message = 'Request successful', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Standard API Error Response
 * @param {import('express').Response} res - Express response object
 * @param {string} message - Human-readable error message
 * @param {*} error - Error details or object
 * @param {number} statusCode - HTTP status code (default: 500)
 */
export const sendError = (res, message = 'Something went wrong', error = {}, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error
  });
};
