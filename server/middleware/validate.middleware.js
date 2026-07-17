import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        msg: err.msg,
        message: err.msg,
      })),
    });
  }

  next();
};

export default validate;
