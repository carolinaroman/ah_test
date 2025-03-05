/**
 * Sends a standardized error response. If the message is a string, it will
 * return {"message": "Error message"}. Otherwise, it will return
 *
 * @param {Object} res - Express response object.
 * @param {number} statusCode - HTTP status code to return.
 * @param {string} message - Error message to include in the response.
 *
 * @returns {Object} - The response object with the error details.
 */
export const sendApiResponse = (res, statusCode, message) => {
  if (typeof message === "string") {
    return res.status(statusCode).json({ message });
  }

  // Handle anything else that's JSON-compatible (objects, arrays, numbers, null, etc.)
  return res.status(statusCode).json(message);
};
