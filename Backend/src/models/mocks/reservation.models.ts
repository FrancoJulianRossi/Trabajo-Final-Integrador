import { Reservation } from "./entities/reservation.entity";
import { ScreeningEntity } from "./entities/screening.entity";
import { seat } from "./entities/seat.entity";
import { screeningMock } from "./screening.models";
import { seats } from "./seat.model";

export class ReservationMock {
  private data: Reservation[];
  constructor() {
    this.data = [];

    // reuse shared mocks when available
    const screening = screeningMock as unknown as ScreeningEntity;

    const seat1 = seats[0];
    const seat2 = seats[1];

    this.data.push(
      new Reservation(1, new Date(), "Pending", 0, screening, [
        seat1,
      ] as unknown as any),
      new Reservation(2, new Date(), "Pending", 0, screening, [
        seat2,
      ] as unknown as any)
    );
  }

  list(): Reservation[] {
    // return a shallow copy to avoid external mutation
    return [...this.data];
  }

  getNextId(): number {
    if (this.data.length === 0) return 1;
    const ids = this.data.map((r) => r.getIdReservation());
    return Math.max(...ids) + 1;
  }

  postReservation(reservation: Reservation): Reservation {
    this.data.push(reservation);
    return reservation;
  }
}
