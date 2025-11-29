"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireAdmin = requireAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = (process.env.JWT_SECRET ||
    "change_this_secret");
function authenticate(req, res, next) {
    const header = req.headers["authorization"];
    if (!header || !header.startsWith("Bearer "))
        return res.status(401).json({ message: "Missing token" });
    const token = (header.split(" ")[1] || "");
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
function requireAdmin(req, res, next) {
    if (!req.user)
        return res.status(401).json({ message: "Not authenticated" });
    if (!req.user.role)
        return res.status(403).json({ message: "Admin required" });
    next();
}
//# sourceMappingURL=auth.middleware.js.map