import { Reservation } from "./entities/reservation.entity";
import { ScreeningEntity } from "./entities/screening.entity";
import { seat } from "./entities/seat.entity";

export class ReservationMock {
  private data: Reservation[];
  private idCounter: number;

  constructor() {
    this.data = [];
    this.idCounter = 1;

    const screening = new ScreeningEntity(
      1,
      new Date(),
      new Date(),
      new Date(Date.now() + 3600000),
      10
    );

    const seat1 = new seat(1, 1, 1);
    const seat2 = new seat(2, 1, 2);

    const res1 = new Reservation(1, new Date(), "Pending", 0, screening, [
      seat1,
    ]);
    const res2 = new Reservation(2, new Date(), "Pending", 0, screening, [
      seat2,
    ]);

    this.data.push(res1, res2);
    this.idCounter = 3;
  }

  getReservations(): Reservation[] {
    return this.data.slice();
  }

  getById(id: number): Reservation | null {
    return this.data.find((r) => r.getIdReservation() === id) || null;
  }

  addReservation(
    screening: ScreeningEntity,
    seatsList: seat[],
    status: any = "Pending"
  ): Reservation {
    // Check for seat conflicts with existing non-canceled reservations for the same screening
    const screeningId = screening.getIdScreening?.() ?? null;
    if (screeningId === null) {
      throw new Error("Invalid screening provided");
    }

    for (const seatReq of seatsList) {
      for (const existing of this.data) {
        if (existing.getStatus() === "Canceled") continue;
        const existingScreening = existing.getScreening();
        if (
          !existingScreening ||
          typeof existingScreening.getIdScreening !== "function"
        )
          continue;
        if (existingScreening.getIdScreening() !== screeningId) continue;
        const existingSeats = existing.getSeat();
        for (const es of existingSeats) {
          if (
            (es as any).row === (seatReq as any).row &&
            (es as any).column === (seatReq as any).column
          ) {
            throw new Error(
              `Seat already occupied at row ${(seatReq as any).row}, column ${
                (seatReq as any).column
              }`
            );
          }
        }
      }
    }

    const newRes = new Reservation(
      this.idCounter++,
      new Date(),
      status,
      0,
      screening,
      seatsList
    );
    // calculate total using reservation helper
    newRes.setTotal(newRes.calculateTotal());
    this.data.push(newRes);
    return newRes;
  }

  cancelReservation(id: number): boolean {
    const res = this.getById(id);
    if (!res) return false;
    res.setStatus("Canceled");
    return true;
  }

  // Reset reservations data (useful for seeding)
  seed(initial: Reservation[]) {
    this.data = initial.map(
      (r, idx) =>
        new Reservation(
          r["idReservation"] ?? idx + 1,
          new Date(r["reservationDate"] || Date.now()),
          r["status"] || "Pending",
          r["total"] || 0,
          r["screening"],
          r["seat"] || []
        )
    );
    this.idCounter = this.data.length
      ? Math.max(...this.data.map((x) => x.getIdReservation())) + 1
      : 1;
  }
}

export default new ReservationMock();
