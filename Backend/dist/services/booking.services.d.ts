import { Reservation } from "../models/reservation.model";
export declare class BookingService {
    listAllReservations(): Promise<Reservation[]>;
    listReservationsByUser(userId: number): Promise<Reservation[]>;
    getReservationById(id: number): Promise<Reservation | null>;
    createReservation(screeningId: number, userId: number, seats: {
        row: number;
        column: number;
    }[]): Promise<Reservation>;
    updateReservation(reservationId: number, newSeats: {
        row: number;
        column: number;
    }[]): Promise<Reservation>;
    cancelReservation(id: number): Promise<void>;
    deleteReservation(id: number): Promise<void>;
}
declare const _default: BookingService;
export default _default;
//# sourceMappingURL=booking.services.d.ts.map