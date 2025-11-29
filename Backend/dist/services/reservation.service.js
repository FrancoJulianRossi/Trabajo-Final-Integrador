"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationService = void 0;
const reservation_entity_1 = require("../models/mocks/entities/reservation.entity");
const reservation_models_1 = require("../models/mocks/reservation.models");
class ReservationService {
    reservationMock;
    constructor() {
        this.reservationMock = new reservation_models_1.ReservationMock();
    }
    async listReservations() {
        return this.reservationMock.list();
    }
    async createReservation(data) {
        const id = data.idReservation ?? this.reservationMock.getNextId();
        const reservationDate = data.reservationDate
            ? new Date(data.reservationDate)
            : new Date();
        const status = data.status ?? "Pending";
        const screening = data.screening ?? null;
        const seat = data.seat ?? [];
        const reservation = new reservation_entity_1.Reservation(id, reservationDate, status, 0, screening, seat);
        const total = reservation.calculateTotal();
        reservation.setTotal(total);
        return this.reservationMock.postReservation(reservation);
    }
    async getReservationById(id) {
        const reservations = this.reservationMock.list();
        const reservation = reservations.find((r) => r.getIdReservation() === id);
        return reservation || null;
    }
}
exports.ReservationService = ReservationService;
exports.default = ReservationService;
//# sourceMappingURL=reservation.service.js.map