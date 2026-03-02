"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
router.post("/users", userController.createUser.bind(userController));
exports.default = router;
//# sourceMappingURL=user.routes.js.map