import { Reservation } from "../models/mocks/entities/reservation.entity";
export declare class ReservationService {
    private reservationMock;
    constructor();
    listReservations(): Promise<Reservation[]>;
    createReservation(data: any): Promise<Reservation>;
    getReservationById(id: number): Promise<Reservation | null>;
}
export default ReservationService;
//# sourceMappingURL=reservation.service.d.ts.map