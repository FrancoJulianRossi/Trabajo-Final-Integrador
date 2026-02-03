/*getScreeningById
getScreenings
createScreening
updateScreening
deleteScreening */
import { Screening } from "../models/screening.model";
import { Reservation } from "../models/reservation.model";
import { ReservationSeat } from "../models/reservation-seat.model";
import { Seat } from "../models/seat.model";
import { Op } from "sequelize";

export class ScreeningService {
  
  async getScreeningById(id: number): Promise<Screening | null> {
    return await Screening.findByPk(id, { include: ["movie", "room"] });
  }

  async getScreenings(): Promise<Screening[]> {
    return await Screening.findAll({ include: ["movie", "room"] });
  }

  async createScreening(data: Partial<Screening>): Promise<Screening> {
    return await Screening.create(data);
  }

  async updateScreening(
    id: number,
    data: Partial<Screening>
  ): Promise<Screening | null> {
    const screening = await Screening.findByPk(id);
    if (!screening) return null;
    return await screening.update(data);
  }

  async deleteScreening(id: number): Promise<boolean> {
    const count = await Screening.destroy({ where: { idScreening: id } });
    return count > 0;
  }

  async getOccupiedSeats(
    screeningId: number
  ): Promise<{ row: number; column: number }[]> {
    const reservations = await Reservation.findAll({
      where: { 
          screeningId, 
          status: { [Op.ne]: "Canceled" } 
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