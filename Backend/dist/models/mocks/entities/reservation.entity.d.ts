import { ScreeningEntity } from "./screening.entity";
import { seat } from "./seat.entity";
export type ReservationStatus = "Pending" | "Paid" | "Canceled";
export declare class Reservation {
    protected idReservation: number;
    protected reservationDate: Date;
    protected status: ReservationStatus;
    protected total: number;
    protected screening: ScreeningEntity;
    protected seat: seat[];
    constructor(idReservation: number, reservationDate: Date, status: ReservationStatus, total: number, screening: ScreeningEntity, seat?: seat[]);
    getIdReservation(): number;
    getReservationDate(): Date;
    getStatus(): ReservationStatus;
    getTotal(): number;
    getScreening(): ScreeningEntity;
    getSeat(): seat[];
    setReservationDate(reservationDate: Date): void;
    setStatus(status: ReservationStatus): void;
    setTotal(total: number): void;
    addSeat(seat: seat): void;
    calculateTotal(): number;
    cancelReservation(): void;
}
//# sourceMappingURL=reservation.entity.d.ts.map