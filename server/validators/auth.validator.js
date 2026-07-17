import { body } from "express-validator";

export const loginValidator = [
  body("email").isEmail().withMessage("Enter Valid Email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password Minimum 6 Characters"),
];
