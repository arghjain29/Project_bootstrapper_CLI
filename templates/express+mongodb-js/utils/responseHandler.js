// Common error messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized access",
  INVALID_TOKEN: "Invalid or expired token",
  NO_TOKEN: "No authentication token provided",
  MALFORMED_TOKEN: "Malformed authentication token",
  REQUIRED_FIELDS: "Required fields are missing",
  SERVER_ERROR: "Internal server error",
  NOT_FOUND: "Resource not found",
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_EXISTS: "Email already registered",
};

// Centralized error response utility
const sendError = (res, statusCode, message, details = null) => {
  const response = {
    success: false,
    error: message,
  };

  // Include details only in development mode
  if (process.env.NODE_ENV === "development" && details) {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};

// Centralized success response utility
const sendSuccess = (res, data, message = null, statusCode = 200) => {
  const response = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  return res.status(statusCode).json(response);
};

export { ERROR_MESSAGES, sendError, sendSuccess };