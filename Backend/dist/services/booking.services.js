"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const reservation_models_1 = __importDefault(require("../models/mocks/reservation.models"));
class BookingService {
    // Simple in-memory lock per screening to simulate concurrency control
    locks = new Map();
    listReservations() {
        return reservation_models_1.default.getReservations();
    }
    getReservationById(id) {
        return reservation_models_1.default.getById(id);
    }
    async createReservation(screening, seatsList) {
        const screeningId = screening.getIdScreening?.();
        if (typeof screeningId !== "number") {
            throw new Error("Invalid screening id");
        }
        // If locked, reject to simulate concurrent access
        if (this.locks.get(screeningId)) {
            throw new Error("Screening is temporarily locked, try again");
        }
        // Acquire lock
        this.locks.set(screeningId, true);
        try {
            // Simulate async operation (DB write)
            const created = reservation_models_1.default.addReservation(screening, seatsList);
            return created;
        }
        finally {
            // Release lock
            this.locks.delete(screeningId);
        }
    }
    cancelReservation(id) {
        return reservation_models_1.default.cancelReservation(id);
    }
}
exports.BookingService = BookingService;
exports.default = new BookingService();
//# sourceMappingURL=booking.services.js.map