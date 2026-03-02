import { ScreeningEntity } from "../models/mocks/entities/screening.entity";
import { seat } from "../models/mocks/entities/seat.entity";
export declare class BookingService {
    private locks;
    listReservations(): import("../models/mocks/entities/reservation.entity").Reservation[];
    getReservationById(id: number): import("../models/mocks/entities/reservation.entity").Reservation | null;
    createReservation(screening: ScreeningEntity, seatsList: seat[]): Promise<import("../models/mocks/entities/reservation.entity").Reservation>;
    cancelReservation(id: number): boolean;
}
declare const _default: BookingService;
export default _default;
//# sourceMappingURL=booking.services.d.ts.map