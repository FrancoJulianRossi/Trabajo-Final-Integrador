import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const router = Router();

router.post("/auth/register", AuthController.register.bind(AuthController));
router.post("/auth/login", AuthController.login.bind(AuthController));

// password recovery endpoints
router.post(
  "/auth/forgot-password",
  AuthController.forgotPassword.bind(AuthController),
);
router.post(
  "/auth/reset-password",
  AuthController.resetPassword.bind(AuthController),
);

export default router;
