"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("../models/user.model");
class UserService {
    constructor() { }
    async getAllUsers() {
        return await user_model_1.User.findAll();
    }
    async getUserById(id) {
        return await user_model_1.User.findByPk(id);
    }
    async getUserByEmail(email) {
        const user = await user_model_1.User.findOne({ where: { email } });
        return user;
    }
    async createUser(userData) {
        return await user_model_1.User.create(userData);
    }
    async updateUser(idUser, userData) {
        const user = await user_model_1.User.findByPk(idUser);
        if (!user) {
            return null;
        }
        return await user.update(userData);
    }
    async deleteUser(idUser) {
        const count = await user_model_1.User.destroy({ where: { idUser } });
        return count > 0;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.services.js.map