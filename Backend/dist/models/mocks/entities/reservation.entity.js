"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = void 0;
class Reservation {
    idReservation;
    reservationDate;
    status;
    total;
    screening;
    seat;
    constructor(idReservation, reservationDate, status, total, 
    // protected user: User,
    screening, seat = []) {
        this.idReservation = idReservation;
        this.reservationDate = reservationDate;
        this.status = status;
        this.total = total;
        this.screening = screening;
        this.seat = seat;
    }
    getIdReservation() {
        return this.idReservation;
    }
    getReservationDate() {
        return this.reservationDate;
    }
    getStatus() {
        return this.status;
    }
    getTotal() {
        return this.total;
    }
    // getUser(): User{
    //     return this.user;
    // }
    getScreening() {
        return this.screening;
    }
    getSeat() {
        return [...this.seat];
    }
    setReservationDate(reservationDate) {
        this.reservationDate = reservationDate;
    }
    setStatus(status) {
        this.status = status;
    }
    setTotal(total) {
        this.total = total;
    }
    addSeat(seat) {
        this.seat.push(seat);
    }
    calculateTotal() {
        const price = this.getScreening().getTicketPrice();
        return this.getSeat().length * price;
    }
    cancelReservation() {
        this.setStatus("Canceled");
    }
}
exports.Reservation = Reservation;
//# sourceMappingURL=reservation.entity.js.map