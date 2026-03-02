import { Reservation } from "../models/reservation.model";
import { ReservationSeat } from "../models/reservation-seat.model";
import { Screening } from "../models/screening.model";
import { Seat } from "../models/seat.model";
import { sequelize } from "../config/database";
import { Op } from "sequelize";

export class BookingService {
  async listReservations(): Promise<Reservation[]> {
    return await Reservation.findAll({
      include: ["screening", "reservationSeats"],
    });
  }

  async getReservationById(id: number): Promise<Reservation | null> {
    return await Reservation.findByPk(id, {
      include: ["screening", "reservationSeats"],
    });
  }

  async createReservation(
    screeningId: number,
    userId: number,
    seats: { row: number; column: number }[],
  ): Promise<Reservation> {
    const t = await sequelize.transaction();
    try {
      const screening = await Screening.findByPk(screeningId, {
        transaction: t,
      });
      if (!screening) throw new Error("Screening not found");

      // Find seats based on row/column and roomId
      const seatInstances: Seat[] = [];
      for (const s of seats) {
        const seat = await Seat.findOne({
          where: { roomId: screening.roomId, row: s.row, column: s.column },
          transaction: t,
        });
        if (!seat)
          throw new Error(`Seat at row ${s.row} col ${s.column} not found`);
        seatInstances.push(seat);
      }

      // Check if any of these seats are already reserved for this screening
      const occupied = await ReservationSeat.findAll({
        where: { seatId: seatInstances.map((s) => s.idSeat) },
        include: [
          {
            model: Reservation,
            where: {
              screeningId: screeningId,
              status: { [Op.or]: ["Pending", "Confirmed", "Paid"] },
            },
          },
        ],
        transaction: t,
      });

      if (occupied.length > 0)
        throw new Error("Some seats are already occupied");

      const total = seatInstances.length * screening.ticketPrice;

      const reservation = await Reservation.create(
        {
          screeningId,
          userId,
          reservationDate: new Date(),
          status: "Confirmed",
          total,
        },
        { transaction: t },
      );

      const reservationSeatsData = seatInstances.map((s) => ({
        reservationId: reservation.idReservation,
        seatId: s.idSeat,
      }));

      await ReservationSeat.bulkCreate(reservationSeatsData, {
        transaction: t,
      });

      await t.commit();

      // Reload to include relations if needed, or return plain
      return reservation;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async cancelReservation(id: number): Promise<void> {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) throw new Error("Reservation not found");
    reservation.status = "Canceled";
    await reservation.save();
  }
}

export default new BookingService();