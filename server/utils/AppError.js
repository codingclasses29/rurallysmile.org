import ApiError from "./ApiError.js";

/** @deprecated Prefer ApiError — kept for existing controllers */
class AppError extends ApiError {
  constructor(message, statusCode = 500, errors = null) {
    super(statusCode, message, errors);
  }
}

export default AppError;
