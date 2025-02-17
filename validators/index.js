import { body } from "express-validator";

const registerValidator = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),

  body("lastName").trim().notEmpty().withMessage("Last name is required"),

  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("age").isInt({ min: 18 }).withMessage("Age must be at least 18"),

  body("gender")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be 'male', 'female', or 'other'"),
];

const loginValidator = [
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export { registerValidator, loginValidator };
