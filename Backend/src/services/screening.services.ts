/*getScreeningById
getScreenings
createScreening
updateScreening
deleteScreening */
import {
  screeningMock,
  screeningMockUpdated,
} from "../models/mocks/screening.models";
import { ScreeningEntity } from "../models/mocks/entities/screening.entity";
import ReservationMock from "../models/mocks/reservation.models";

export class ScreeningService {
  private screenings: ScreeningEntity[];
  constructor() {
    // seed with available mocks
    this.screenings = [screeningMock, screeningMockUpdated];
  }

  public getScreeningById(id: number): ScreeningEntity | null {
    return this.screenings.find((s) => s.getIdScreening() === id) || null;
  }

  public getScreenings(): ScreeningEntity[] {
    return [...this.screenings];
  }

  public createScreening(screening: ScreeningEntity): ScreeningEntity {
    const newId = this.screenings.length
      ? Math.max(...this.screenings.map((s) => s.getIdScreening())) + 1
      : 1;
    const newScreening = new ScreeningEntity(
      newId,
      screening.getDate(),
      screening.getStart(),
      screening.getEnd(),
      screening.getTicketPrice()
    );
    this.screenings.push(newScreening);
    return newScreening;
  }

  public updateScreening(
    id: number,
    screening: ScreeningEntity
  ): ScreeningEntity | null {
    const idx = this.screenings.findIndex((s) => s.getIdScreening() === id);
    if (idx === -1) return null;
    const updated = new ScreeningEntity(
      id,
      screening.getDate(),
      screening.getStart(),
      screening.getEnd(),
      screening.getTicketPrice()
    );
    this.screenings[idx] = updated;
    return updated;
  }

  public deleteScreening(id: number): boolean {
    const initial = this.screenings.length;
    this.screenings = this.screenings.filter((s) => s.getIdScreening() !== id);
    return this.screenings.length < initial;
  }

  public getOccupiedSeats(
    screeningId: number
  ): { row: number; column: number }[] {
    const reservations = ReservationMock.getReservations();
    const occupied: { row: number; column: number }[] = [];
    for (const r of reservations) {
      const scr = r.getScreening();
      if (
        scr &&
        typeof scr.getIdScreening === "function" &&
        scr.getIdScreening() === screeningId
      ) {
        const seats = r.getSeat();
        for (const s of seats) {
          occupied.push({
            row: (s as any).row ?? 0,
            column: (s as any).column ?? 0,
          });
        }
      }
    }
    return occupied;
  }
}