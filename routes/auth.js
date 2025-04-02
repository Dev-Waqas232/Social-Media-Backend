import express from "express";

import {
  login,
  register,
  requestResetPassword,
  resetPassword,
} from "../controllers/auth.js";
import { loginValidator, registerValidator } from "../validators/index.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 */

router.post("/register", registerValidator, validate, register);

router.post("/login", loginValidator, validate, login);

router.post("/request-reset-password", requestResetPassword);

router.post("/reset-password/:token", resetPassword);

export { router as authRouter };
