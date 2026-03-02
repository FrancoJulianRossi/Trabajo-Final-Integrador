import { Reservation } from "./entities/reservation.entity";
import { ScreeningEntity } from "./entities/screening.entity";
import { seat } from "./entities/seat.entity";
export declare class ReservationMock {
    private data;
    private idCounter;
    constructor();
    getReservations(): Reservation[];
    getById(id: number): Reservation | null;
    addReservation(screening: ScreeningEntity, seatsList: seat[], status?: any): Reservation;
    cancelReservation(id: number): boolean;
    seed(initial: Reservation[]): void;
}
declare const _default: ReservationMock;
export default _default;
//# sourceMappingURL=reservation.models.d.ts.map