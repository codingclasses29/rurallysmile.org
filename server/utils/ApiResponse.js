class ApiResponse {
  constructor(statusCode, message, data = null, errors = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (errors !== null) {
      this.errors = errors;
    }
  }

  static success(message, data = null, statusCode = 200) {
    return new ApiResponse(statusCode, message, data, null);
  }

  static error(message, errors = null, statusCode = 400) {
    return new ApiResponse(statusCode, message, null, errors);
  }
}

export const sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, message, data));
};

export const sendError = (res, statusCode, message, errors = null) => {
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, message, null, errors));
};

export { ApiResponse };
export default ApiResponse;
