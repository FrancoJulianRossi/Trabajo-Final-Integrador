"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationMock = void 0;
const reservation_entity_1 = require("./entities/reservation.entity");
const screening_entity_1 = require("./entities/screening.entity");
const seat_entity_1 = require("./entities/seat.entity");
class ReservationMock {
    data;
    idCounter;
    constructor() {
        this.data = [];
        this.idCounter = 1;
        const screening = new screening_entity_1.ScreeningEntity(1, new Date(), new Date(), new Date(Date.now() + 3600000), 10);
        const seat1 = new seat_entity_1.seat(1, 1, 1);
        const seat2 = new seat_entity_1.seat(2, 1, 2);
        const res1 = new reservation_entity_1.Reservation(1, new Date(), "Pending", 0, screening, [
            seat1,
        ]);
        const res2 = new reservation_entity_1.Reservation(2, new Date(), "Pending", 0, screening, [
            seat2,
        ]);
        this.data.push(res1, res2);
        this.idCounter = 3;
    }
    getReservations() {
        return this.data.slice();
    }
    getById(id) {
        return this.data.find((r) => r.getIdReservation() === id) || null;
    }
    addReservation(screening, seatsList, status = "Pending") {
        // Check for seat conflicts with existing non-canceled reservations for the same screening
        const screeningId = screening.getIdScreening?.() ?? null;
        if (screeningId === null) {
            throw new Error("Invalid screening provided");
        }
        for (const seatReq of seatsList) {
            for (const existing of this.data) {
                if (existing.getStatus() === "Canceled")
                    continue;
                const existingScreening = existing.getScreening();
                if (!existingScreening ||
                    typeof existingScreening.getIdScreening !== "function")
                    continue;
                if (existingScreening.getIdScreening() !== screeningId)
                    continue;
                const existingSeats = existing.getSeat();
                for (const es of existingSeats) {
                    if (es.row === seatReq.row &&
                        es.column === seatReq.column) {
                        throw new Error(`Seat already occupied at row ${seatReq.row}, column ${seatReq.column}`);
                    }
                }
            }
        }
        const newRes = new reservation_entity_1.Reservation(this.idCounter++, new Date(), status, 0, screening, seatsList);
        // calculate total using reservation helper
        newRes.setTotal(newRes.calculateTotal());
        this.data.push(newRes);
        return newRes;
    }
    cancelReservation(id) {
        const res = this.getById(id);
        if (!res)
            return false;
        res.setStatus("Canceled");
        return true;
    }
    // Reset reservations data (useful for seeding)
    seed(initial) {
        this.data = initial.map((r, idx) => new reservation_entity_1.Reservation(r["idReservation"] ?? idx + 1, new Date(r["reservationDate"] || Date.now()), r["status"] || "Pending", r["total"] || 0, r["screening"], r["seat"] || []));
        this.idCounter = this.data.length
            ? Math.max(...this.data.map((x) => x.getIdReservation())) + 1
            : 1;
    }
}
exports.ReservationMock = ReservationMock;
exports.default = new ReservationMock();
//# sourceMappingURL=reservation.models.js.map