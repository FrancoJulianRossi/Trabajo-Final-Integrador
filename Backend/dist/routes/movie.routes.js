"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movie_controller_1 = __importDefault(require("../controllers/movie.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/movies", movie_controller_1.default.list.bind(movie_controller_1.default));
router.get("/movies/:id", movie_controller_1.default.getById.bind(movie_controller_1.default));
router.post("/movies", auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, movie_controller_1.default.create.bind(movie_controller_1.default));
router.put("/movies/:id", auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, movie_controller_1.default.update.bind(movie_controller_1.default));
router.delete("/movies/:id", auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, movie_controller_1.default.delete.bind(movie_controller_1.default));
exports.default = router;
//# sourceMappingURL=movie.routes.js.map