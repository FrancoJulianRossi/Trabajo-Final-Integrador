import ReservationMock from "../models/mocks/reservation.models";
import { ScreeningEntity } from "../models/mocks/entities/screening.entity";
import { seat } from "../models/mocks/entities/seat.entity";

export class BookingService {
  // Simple in-memory lock per screening to simulate concurrency control
  private locks: Map<number, boolean> = new Map();

  listReservations() {
    return ReservationMock.getReservations();
  }

  getReservationById(id: number) {
    return ReservationMock.getById(id);
  }

  async createReservation(screening: ScreeningEntity, seatsList: seat[]) {
    const screeningId = screening.getIdScreening?.();
    if (typeof screeningId !== "number") {
      throw new Error("Invalid screening id");
    }

    // If locked, reject to simulate concurrent access
    if (this.locks.get(screeningId)) {
      throw new Error("Screening is temporarily locked, try again");
    }

    // Acquire lock
    this.locks.set(screeningId, true);

    try {
      // Simulate async operation (DB write)
      const created = ReservationMock.addReservation(screening, seatsList);
      return created;
    } finally {
      // Release lock
      this.locks.delete(screeningId);
    }
  }

  cancelReservation(id: number) {
    return ReservationMock.cancelReservation(id);
  }
}

export default new BookingService();
