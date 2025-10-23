import { Reservation } from "./entities/reservation.entity";

export class ReservationMock extends Reservation{
    calculateTotal(): number{
        this.screening.getTicketPrice();
        
    }
}