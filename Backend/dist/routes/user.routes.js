"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
// profile endpoints (authenticated user)
router.get("/users/me", auth_middleware_1.authenticate, userController.getProfile.bind(userController));
router.put("/users/me", auth_middleware_1.authenticate, userController.updateProfile.bind(userController));
router.get("/users", auth_middleware_1.authenticate, userController.getUsers.bind(userController));
router.post("/users", auth_middleware_1.authenticate, // Added authentication for creating user
userController.createUser.bind(userController));
router.put("/users/:id", auth_middleware_1.authenticate, userController.updateUser.bind(userController));
router.delete("/users/:id", auth_middleware_1.authenticate, userController.deleteUser.bind(userController));
exports.default = router;
//# sourceMappingURL=user.routes.js.map