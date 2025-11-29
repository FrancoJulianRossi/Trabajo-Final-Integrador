"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservation_controller_1 = require("../controllers/reservation.controller");
const router = express_1.default.Router();
// GET /reservation
router.get("/reservation", (req, res) => reservation_controller_1.reservationController.listHandler(req, res));
// POST /reservation
router.post("/reservation", (req, res) => reservation_controller_1.reservationController.createHandler(req, res));
exports.default = router;
//# sourceMappingURL=reservation.route.js.map