"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = exports.getBookings = void 0;
const booking_services_1 = __importDefault(require("../services/booking.services"));
const screening_entity_1 = require("../models/mocks/entities/screening.entity");
const seat_entity_1 = require("../models/mocks/entities/seat.entity");
const getBookings = (req, res) => {
    const reservations = booking_services_1.default.listReservations();
    return res.status(200).json(reservations);
};
exports.getBookings = getBookings;
const createBooking = async (req, res) => {
    const { screening, seats } = req.body;
    if (!screening || !seats) {
        return res.status(400).json({ message: "Missing screening or seats" });
    }
    const screeningEntity = new screening_entity_1.ScreeningEntity(screening.idScreening ?? 0, screening.date, screening.start, screening.end, screening.ticketPrice ?? 0);
    const seatEntities = Array.isArray(seats)
        ? seats.map((s, idx) => new seat_entity_1.seat(s.id ?? idx + 1, s.row ?? 1, s.column ?? 1))
        : [];
    try {
        const created = await booking_services_1.default.createReservation(screeningEntity, seatEntities);
        return res.status(201).json(created);
    }
    catch (err) {
        if (!err) {
            return res.status(500).json({ message: "Unknown error" });
        }
        if (err.message && err.message.startsWith("Seat already occupied")) {
            return res.status(409).json({ message: err.message });
        }
        if (err.message && err.message.includes("locked")) {
            return res.status(423).json({ message: err.message });
        }
        return res.status(500).json({ message: err.message || "Unknown error" });
    }
};
exports.createBooking = createBooking;
//# sourceMappingURL=booking.controller.js.map