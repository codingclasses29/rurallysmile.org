const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || null;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Failed";
    errors = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      msg: e.message,
      message: e.message,
    }));
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    message = `${field} already exists`;
    errors = [{ field, msg: message, message }];
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token Expired";
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  const payload = {
    success: false,
    message,
  };

  if (errors) {
    payload.errors = errors;
  }

  if (process.env.NODE_ENV !== "production" && statusCode === 500) {
    payload.stack = err.stack;
  }

  return res.status(statusCode).json(payload);
};

export default errorHandler;
