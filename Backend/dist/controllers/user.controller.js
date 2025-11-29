"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_services_1 = require("../services/user.services");
const user_entity_1 = require("../models/mocks/entities/user.entity");
class UserController {
    userService;
    constructor() {
        this.userService = new user_services_1.UserService();
    }
    async createUser(req, res) {
        const { idUser, name, email, password, role = 1 } = req.body;
        const newUser = new user_entity_1.User(idUser, name, email, password, role);
        this.userService.createUser(newUser);
        return res.status(201).json({ message: "User created successfully" });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map