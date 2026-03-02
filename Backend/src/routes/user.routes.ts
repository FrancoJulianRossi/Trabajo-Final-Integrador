import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const userController = new UserController();

// profile endpoints (authenticated user)
router.get(
  "/users/me",
  authenticate,
  userController.getProfile.bind(userController),
);
router.put(
  "/users/me",
  authenticate,
  userController.updateProfile.bind(userController),
);

router.get(
  "/users",
  authenticate,
  userController.getUsers.bind(userController),
);
router.post(
  "/users",
  authenticate, // Added authentication for creating user
  userController.createUser.bind(userController),
);
router.put(
  "/users/:id",
  authenticate,
  userController.updateUser.bind(userController),
);
router.delete(
  "/users/:id",
  authenticate,
  userController.deleteUser.bind(userController),
);

export default router;
