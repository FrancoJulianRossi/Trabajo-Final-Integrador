<<<<<<< CRM-16-controller-reservation
import { User } from "../models/user.model";
=======
>>>>>>> dev
import { Reservation } from "../models/reservation.model";
import { ReservationSeat } from "../models/reservation-seat.model";
import { Screening } from "../models/screening.model";
import { Seat } from "../models/seat.model";
<<<<<<< CRM-16-controller-reservation
import { Movie } from "../models/movie.model";
import { Room } from "../models/room.model";
=======
>>>>>>> dev
import { sequelize } from "../config/database";
import { Op } from "sequelize";

export class BookingService {
<<<<<<< CRM-16-controller-reservation
  async listAllReservations(): Promise<Reservation[]> {
    return await Reservation.findAll({
      include: [
        {
          model: User,
        },
        {
          model: Screening,
          include: [
            {
              model: Movie,
            },
            {
              model: Room, // Include the Room model here
            },
          ],
        },
        {
          model: ReservationSeat,
          include: [Seat],
        },
      ],
    });
  }

  async listReservationsByUser(userId: number): Promise<Reservation[]> {
    return await Reservation.findAll({
      where: { userId },
      include: [
        {
          model: Screening,
          include: [
            {
              model: Movie,
            },
            {
              model: Room, // Include the Room model here
            },
          ],
        },
        {
          model: ReservationSeat,
          include: [Seat],
        },
      ],
=======
  async listReservations(): Promise<Reservation[]> {
    return await Reservation.findAll({
      include: ["screening", "reservationSeats"],
>>>>>>> dev
    });
  }

  async getReservationById(id: number): Promise<Reservation | null> {
    return await Reservation.findByPk(id, {
<<<<<<< CRM-16-controller-reservation
      include: [
        {
          model: Screening,
          include: [
            {
              model: Movie,
            },
            {
              model: Room, // Include the Room model here
            },
          ],
        },
        {
          model: ReservationSeat,
          include: [Seat],
        },
      ],
=======
      include: ["screening", "reservationSeats"],
>>>>>>> dev
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
<<<<<<< CRM-16-controller-reservation

      // Check if any of these seats are already reserved for this screening.
      // We lock the matching rows to prevent concurrent inserts on the same seats.
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
        lock: t.LOCK.UPDATE,
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
        screeningId,
        seatId: s.idSeat,
      }));

      try {
        await ReservationSeat.bulkCreate(reservationSeatsData, {
          transaction: t,
        });
      } catch (err: any) {
        // If another transaction slipped through and inserted the same seat for
        // this screening, the unique index will raise a constraint error.
        if (err.name === "SequelizeUniqueConstraintError") {
          throw new Error("Some seats are already occupied");
        }
        throw err;
      }

=======

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

>>>>>>> dev
      await t.commit();

      // Reload to include relations if needed, or return plain
      return reservation;
    } catch (error) {
<<<<<<< CRM-16-controller-reservation
      // rollback may already have happened; ignore failure
      try {
        await t.rollback();
      } catch (e) {
        // no-op
      }
      throw error;
    }
  }

  async updateReservation(
    reservationId: number,
    newSeats: { row: number; column: number }[],
  ): Promise<Reservation> {
    const t = await sequelize.transaction();
    try {
      const reservation = await Reservation.findByPk(reservationId, {
        include: ["screening", "reservationSeats"],
        transaction: t,
      });

      if (!reservation) throw new Error("Reservation not found");

      const screening = await Screening.findByPk(reservation.screeningId, {
        transaction: t,
      });
      if (!screening) throw new Error("Screening not found");

      // 1. Resolve newSeats to Seat IDs
      const seatIds: number[] = [];
      for (const ns of newSeats) {
        const seat = await Seat.findOne({
          where: { roomId: screening.roomId, row: ns.row, column: ns.column },
          transaction: t,
        });
        if (!seat)
          throw new Error(`Seat ${ns.row}-${ns.column} not found in room`);
        seatIds.push(seat.idSeat);
      }

      // 2. Sync ReservationSeats
      // Current seats
      const currentReservationSeats = await ReservationSeat.findAll({
        where: { reservationId: reservationId },
        transaction: t,
      });
      const currentSeatIds = currentReservationSeats.map((rs) => rs.seatId);

      // Identify to remove
      const toRemove = currentSeatIds.filter((id) => !seatIds.includes(id));
      // Identify to add
      const toAdd = seatIds.filter((id) => !currentSeatIds.includes(id));

      // Remove
      if (toRemove.length > 0) {
        await ReservationSeat.destroy({
          where: {
            reservationId: reservationId,
            seatId: toRemove,
          },
          transaction: t,
        });
      }

      // Add (Check availability first)
      if (toAdd.length > 0) {
        // Check if these seats are occupied by OTHER reservations
        const occupied = await ReservationSeat.findAll({
          where: { seatId: toAdd },
          include: [
            {
              model: Reservation,
              where: {
                screeningId: reservation.screeningId,
                idReservation: { [Op.ne]: reservationId }, // Exclude current reservation
                status: { [Op.or]: ["Pending", "Confirmed", "Paid"] },
              },
            },
          ],
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (occupied.length > 0)
          throw new Error("Some new seats are already occupied");

        const newEntries = toAdd.map((sid) => ({
          reservationId: reservationId,
          screeningId: reservation.screeningId,
          seatId: sid,
        }));
        try {
          await ReservationSeat.bulkCreate(newEntries, { transaction: t });
        } catch (err: any) {
          if (err.name === "SequelizeUniqueConstraintError") {
            throw new Error("Some new seats are already occupied");
          }
          throw err;
        }
      }

      // 3. Update Total
      const finalSeatCount = seatIds.length;
      const newTotal = finalSeatCount * screening.ticketPrice;

      reservation.total = newTotal;
      await reservation.save({ transaction: t });

      await t.commit();

      return (await this.getReservationById(reservationId))!;
    } catch (err) {
      // safe rollback
      try {
        await t.rollback();
      } catch (e) {
        // ignore if already finished
      }
      throw err;
=======
      await t.rollback();
      throw error;
>>>>>>> dev
    }
  }

  async cancelReservation(id: number): Promise<void> {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) throw new Error("Reservation not found");
    reservation.status = "Canceled";
    await reservation.save();
<<<<<<< CRM-16-controller-reservation
  }

  async deleteReservation(id: number): Promise<void> {
    const t = await sequelize.transaction();
    try {
      // Delete associated seats first
      await ReservationSeat.destroy({
        where: { reservationId: id },
        transaction: t,
      });

      // Delete the reservation
      const deleted = await Reservation.destroy({
        where: { idReservation: id },
        transaction: t,
      });

      if (deleted === 0) {
        throw new Error("Reservation not found");
      }

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
=======
>>>>>>> dev
  }
}

export default new BookingService();