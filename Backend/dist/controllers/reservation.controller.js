"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationController = exports.ReservationController = void 0;
const reservation_service_1 = __importDefault(require("../services/reservation.service"));
class ReservationController {
    reservationService;
    constructor() {
        this.reservationService = new reservation_service_1.default();
    }
    // Express handler: GET /reservation
    async listHandler(req, res) {
        try {
            const reservations = await this.reservationService.listReservations();
            res.status(200).json(reservations);
        }
        catch (err) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.status(500).json({ error: "Failed to list reservations" });
        }
    }
    // Express handler: POST /reservation
    async createHandler(req, res) {
        try {
            const body = req.body;
            // Basic validation: ensure screening and seat are present
            if (!body || typeof body !== "object") {
                res.status(400).json({ error: "Invalid payload" });
                return;
            }
            const created = await this.reservationService.createReservation(body);
            res.status(201).json(created);
        }
        catch (err) {
            // If the service throws a validation-like error, map to 400
            // otherwise 500
            // tslint:disable-next-line:no-console
            console.error(err);
            if (err && err.name === "ValidationError") {
                res.status(400).json({ error: err.message });
            }
            else {
                res.status(500).json({ error: "Failed to create reservation" });
            }
        }
    }
}
exports.ReservationController = ReservationController;
// export an instance for convenience when wiring routes
exports.reservationController = new ReservationController();
exports.default = ReservationController;
//# sourceMappingURL=reservation.controller.js.map