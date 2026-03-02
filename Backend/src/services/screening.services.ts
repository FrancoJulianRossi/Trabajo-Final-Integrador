/*getScreeningById
getScreenings
createScreening
updateScreening
deleteScreening */
import { Screening } from "../models/screening.model";
import { Movie } from "../models/movie.model";
import { Reservation } from "../models/reservation.model";
import { ReservationSeat } from "../models/reservation-seat.model";
import { Seat } from "../models/seat.model";
import { Op } from "sequelize";

export class ScreeningHasReservationsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScreeningHasReservationsError";
  }
}

export class ScreeningValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScreeningValidationError";
  }
}

export class ScreeningService {
  async getScreeningById(id: number): Promise<Screening | null> {
    return await Screening.findByPk(id, { include: ["movie", "room"] });
  }

  async getScreenings(movieId?: number): Promise<Screening[]> {
    const whereClause: { movieId?: number } = {};
    if (movieId) {
      whereClause.movieId = movieId;
    }
    const result = await Screening.findAll({
      where: whereClause,
      include: ["movie", "room"],
    });
    return result;
  }

  /**
   * Calculates the end time of a screening based on movie length and start time.
   * Mutates the provided `data` object to include `end` if possible.
   */
  private async computeEndTime(data: Partial<Screening>) {
    // only compute if movieId and start are present and either end is missing or we
    // think it should be recalculated (start/movie changed)
    if (!data.movieId || !data.start) return;

    const movie = await Movie.findByPk(data.movieId);
    if (!movie || typeof movie.length !== "number") return;

    const startDate = new Date(data.start as string | Date);
    if (isNaN(startDate.getTime())) return;

    const endDate = new Date(startDate.getTime() + movie.length * 60 * 1000);
    data.end = endDate;
  }

  private async validateTiming(
    data: Partial<Screening>,
    excludeId?: number,
  ): Promise<void> {
    // we need start, end, roomId and date to perform meaningful checks
    if (!data.start || !data.end || !data.roomId || !data.date) return;

    const startDate = new Date(data.start as string | Date);
    const endDate = new Date(data.end as string | Date);
    const now = new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return;

    // cannot schedule in the past
    if (startDate.getTime() < now.getTime()) {
      throw new ScreeningValidationError(
        "Cannot schedule screening in the past",
      );
    }

    // check for overlapping screenings in the same room and date
    const where: any = {
      roomId: data.roomId,
      date: data.date,
      start: { [Op.lt]: endDate },
      end: { [Op.gt]: startDate },
    };
    if (excludeId) {
      where.idScreening = { [Op.ne]: excludeId };
    }

    const overlapping = await Screening.findOne({ where });
    if (overlapping) {
      throw new ScreeningValidationError(
        "Screening overlaps with another screening in the same room",
      );
    }
  }

  async createScreening(data: Partial<Screening>): Promise<Screening> {
    await this.computeEndTime(data);
    await this.validateTiming(data);
    return await Screening.create(data);
  }

  async updateScreening(
    id: number,
    data: Partial<Screening>,
  ): Promise<Screening | null> {
    const screening = await Screening.findByPk(id);
    if (!screening) return null;

    // if start time or movie changed we should recalc end.
    if (data.start || data.movieId) {
      // merge old values so computeEndTime has what it needs
      const merged: Partial<Screening> = {
        movieId: data.movieId ?? screening.movieId,
        start: data.start ?? screening.start,
      };
      await this.computeEndTime(merged);
      if (merged.end) {
        data.end = merged.end;
      }
    }

    // build final object for validation using existing values when not provided
    const finalData: Partial<Screening> = {
      movieId: data.movieId ?? screening.movieId,
      roomId: data.roomId ?? screening.roomId,
      date: data.date ?? screening.date,
      start: data.start ?? screening.start,
      end: data.end ?? screening.end,
    };
    await this.validateTiming(finalData, id);

    return await screening.update(data);
  }

  async deleteScreening(id: number): Promise<boolean> {
    // Check for existing active reservations
    const activeReservationsCount = await Reservation.count({
      where: {
        screeningId: id,
        status: {
          [Op.notIn]: ["Canceled"], // Assuming "Canceled" status means it's not an obstacle
        },
      },
    });

    if (activeReservationsCount > 0) {
      throw new ScreeningHasReservationsError(
        "Cannot delete screening: it has active reservations.",
      );
    }

    const count = await Screening.destroy({ where: { idScreening: id } });
    return count > 0;
  }

  async getOccupiedSeats(
    screeningId: number,
  ): Promise<{ row: number; column: number }[]> {
    const reservations = await Reservation.findAll({
      where: {
        screeningId,
        status: { [Op.ne]: "Canceled" },
      },
      include: [
        {
          model: ReservationSeat,
          include: [Seat],
        },
      ],
    });

    const occupied: { row: number; column: number }[] = [];
    reservations.forEach((r) => {
      r.reservationSeats?.forEach((rs) => {
        if (rs.seat) {
          occupied.push({
            row: rs.seat.row,
            column: rs.seat.column,
          });
        }
      });
    });
    return occupied;
  }
}