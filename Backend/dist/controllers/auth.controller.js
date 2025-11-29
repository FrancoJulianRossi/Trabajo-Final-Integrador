"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const user_services_1 = require("../services/user.services");
const user_entity_1 = require("../models/mocks/entities/user.entity");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
class AuthController {
    userService = new user_services_1.UserService();
    async register(req, res) {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "Missing fields" });
        const existing = this.userService.getUserByEmail(email);
        if (existing)
            return res.status(409).json({ message: "Email in use" });
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const id = Date.now();
        const newUser = new user_entity_1.User(id, name, email, hashed, false);
        this.userService.createUser(newUser);
        return res.status(201).json({ message: "User registered" });
    }
    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Missing email or password" });
        const user = this.userService.getUserByEmail(email);
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });
        const ok = await bcryptjs_1.default.compare(password, user.getPassword());
        if (!ok)
            return res.status(401).json({ message: "Invalid credentials" });
        const payload = {
            idUser: user.getIdUser(),
            email: user.getEmail(),
            role: user.getRole(),
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "8h" });
        return res.status(200).json({
            token,
            user: {
                idUser: user.getIdUser(),
                name: user.getName(),
                email: user.getEmail(),
                role: user.getRole(),
            },
        });
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map