"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_models_1 = __importDefault(require("../models/mocks/user.models"));
class UserService {
    constructor() { }
    getUserById(id) {
        return user_models_1.default.getUsers().find((user) => user.getIdUser() === id) || null;
    }
    getUserByEmail(email) {
        return (user_models_1.default.getUsers().find((user) => user.getEmail() === email) || null);
    }
    createUser(user) {
        user_models_1.default.getUsers().push(user);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.services.js.map