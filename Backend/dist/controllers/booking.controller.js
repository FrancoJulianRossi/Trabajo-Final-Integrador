"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.updateBooking = exports.createBooking = exports.getAllBookingsAdmin = exports.getBookings = void 0;
const booking_services_1 = __importDefault(require("../services/booking.services"));
const getBookings = async (req, res) => {
    try {
        const user = req.user;
        const userId = user?.idUser;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const reservations = await booking_services_1.default.listReservationsByUser(userId);
        return res.status(200).json(reservations);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getBookings = getBookings;
const getAllBookingsAdmin = async (req, res) => {
    try {
        const user = req.user; // Ensure user is authenticated, though not for filtering
        if (!user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const reservations = await booking_services_1.default.listAllReservations();
        return res.status(200).json(reservations);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getAllBookingsAdmin = getAllBookingsAdmin;
const createBooking = async (req, res) => {
    const { screening, seats, userId: requestedUserId } = req.body;
    const user = req.user;
    if (!screening || !seats) {
        return res.status(400).json({ message: "Missing screening or seats" });
    }
    // Determine which user to attribute this booking to. Admin users may specify a different
    // userId in the request body; regular users are limited to their own id.
    let userId = user?.idUser;
    const isAdmin = user &&
        (String(user.role).toLowerCase() === "admin" || user.role === true);
    if (isAdmin && requestedUserId) {
        userId = requestedUserId;
    }
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    const screeningId = screening.idScreening;
    try {
        const created = await booking_services_1.default.createReservation(screeningId, userId, seats);
        return res.status(201).json(created);
    }
    catch (err) {
        if (!err) {
            return res.status(500).json({ message: "Unknown error" });
        }
        if (err.message && err.message.includes("occupied")) {
            return res.status(409).json({ message: err.message });
        }
        return res.status(500).json({ message: err.message || "Unknown error" });
    }
};
exports.createBooking = createBooking;
const updateBooking = async (req, res) => {
    const { id } = req.params;
    const { seats } = req.body; // Expecting { row, column }[]
    if (!seats || !Array.isArray(seats)) {
        return res.status(400).json({ message: "Invalid seats data" });
    }
    try {
        const updated = await booking_services_1.default.updateReservation(Number(id), seats);
        return res.json(updated);
    }
    catch (err) {
        if (err.message && err.message.includes("occupied")) {
            return res.status(409).json({ message: err.message });
        }
        return res.status(500).json({ message: err.message || "Unknown error" });
    }
};
exports.updateBooking = updateBooking;
const deleteBooking = async (req, res) => {
    const { id } = req.params;
    try {
        await booking_services_1.default.deleteReservation(Number(id));
        return res.status(204).send();
    }
    catch (err) {
        if (err.message === "Reservation not found") {
            return res.status(404).json({ message: "Reservation not found" });
        }
        return res.status(500).json({ message: err.message || "Unknown error" });
    }
};
exports.deleteBooking = deleteBooking;
//# sourceMappingURL=booking.controller.js.map