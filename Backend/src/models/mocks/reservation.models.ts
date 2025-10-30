import { Reservation } from "./entities/reservation.entity";
import { Screening } from "./screening";
import { seats } from "./seat.model";

export class ReservationMock {
    private data: Reservation[];
    constructor() {
        this.data = [];

        const screening = Screening.build({
            idScreening: 1,
            date: new Date(),
            start: new Date(),
            end: new Date(Date.now() + 3600000),
            ticketPrice: 10
        });

        const seat1 = new seats("A1", 1, 1);
        const seat2 = new seats("A2", 1, 2);

        this.data.push(
            new Reservation(1, new Date(), "Pending", 0, screening, seat1 as unknown as any),
            new Reservation(2, new Date(), "Pending", 0, screening, seat2 as unknown as any)
        )
    }

    getReservations(): Reservation[] {
        return this.data;
    }




}