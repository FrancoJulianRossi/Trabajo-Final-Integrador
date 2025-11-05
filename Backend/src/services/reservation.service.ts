import { Reservation } from "../models/mocks/entities/reservation.entity";
import { ReservationMock } from "../models/mocks/reservation.models";

export class ReservationService {
  private reservationMock: ReservationMock;
  constructor() {
    this.reservationMock = new ReservationMock();
  }

  async listReservations(): Promise<Reservation[]> {
    return this.reservationMock.list();
  }

  async createReservation(data: any): Promise<Reservation> {
    const id = data.idReservation ?? this.reservationMock.getNextId();
    const reservationDate = data.reservationDate
      ? new Date(data.reservationDate)
      : new Date();
    const status = data.status ?? "Pending";
    const screening = data.screening ?? (null as any);
    const seat = data.seat ?? [];

    const reservation = new Reservation(
      id,
      reservationDate,
      status,
      0,
      screening,
      seat
    );

    const total = reservation.calculateTotal();
    reservation.setTotal(total);

    return this.reservationMock.postReservation(reservation);
  }

  async getReservationById(id: number): Promise<Reservation | null> {
    const reservations = this.reservationMock.list();
    const reservation = reservations.find((r) => r.getIdReservation() === id);
    return reservation || null;
  }
}

export default ReservationService;
