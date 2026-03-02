"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const user_model_1 = require("../models/user.model");
const reservation_model_1 = require("../models/reservation.model");
const reservation_seat_model_1 = require("../models/reservation-seat.model");
const screening_model_1 = require("../models/screening.model");
const seat_model_1 = require("../models/seat.model");
const movie_model_1 = require("../models/movie.model");
const room_model_1 = require("../models/room.model");
const database_1 = require("../config/database");
const sequelize_1 = require("sequelize");
class BookingService {
    async listAllReservations() {
        return await reservation_model_1.Reservation.findAll({
            include: [
                {
                    model: user_model_1.User,
                },
                {
                    model: screening_model_1.Screening,
                    include: [
                        {
                            model: movie_model_1.Movie,
                        },
                        {
                            model: room_model_1.Room, // Include the Room model here
                        },
                    ],
                },
                {
                    model: reservation_seat_model_1.ReservationSeat,
                    include: [seat_model_1.Seat],
                },
            ],
        });
    }
    async listReservationsByUser(userId) {
        return await reservation_model_1.Reservation.findAll({
            where: { userId },
            include: [
                {
                    model: screening_model_1.Screening,
                    include: [
                        {
                            model: movie_model_1.Movie,
                        },
                        {
                            model: room_model_1.Room, // Include the Room model here
                        },
                    ],
                },
                {
                    model: reservation_seat_model_1.ReservationSeat,
                    include: [seat_model_1.Seat],
                },
            ],
        });
    }
    async getReservationById(id) {
        return await reservation_model_1.Reservation.findByPk(id, {
            include: [
                {
                    model: screening_model_1.Screening,
                    include: [
                        {
                            model: movie_model_1.Movie,
                        },
                        {
                            model: room_model_1.Room, // Include the Room model here
                        },
                    ],
                },
                {
                    model: reservation_seat_model_1.ReservationSeat,
                    include: [seat_model_1.Seat],
                },
            ],
        });
    }
    async createReservation(screeningId, userId, seats) {
        const t = await database_1.sequelize.transaction();
        try {
            const screening = await screening_model_1.Screening.findByPk(screeningId, {
                transaction: t,
            });
            if (!screening)
                throw new Error("Screening not found");
            // Find seats based on row/column and roomId
            const seatInstances = [];
            for (const s of seats) {
                const seat = await seat_model_1.Seat.findOne({
                    where: { roomId: screening.roomId, row: s.row, column: s.column },
                    transaction: t,
                });
                if (!seat)
                    throw new Error(`Seat at row ${s.row} col ${s.column} not found`);
                seatInstances.push(seat);
            }
            // Check if any of these seats are already reserved for this screening.
            // We lock the matching rows to prevent concurrent inserts on the same seats.
            const occupied = await reservation_seat_model_1.ReservationSeat.findAll({
                where: { seatId: seatInstances.map((s) => s.idSeat) },
                include: [
                    {
                        model: reservation_model_1.Reservation,
                        where: {
                            screeningId: screeningId,
                            status: { [sequelize_1.Op.or]: ["Pending", "Confirmed", "Paid"] },
                        },
                    },
                ],
                transaction: t,
                lock: t.LOCK.UPDATE,
            });
            if (occupied.length > 0)
                throw new Error("Some seats are already occupied");
            const total = seatInstances.length * screening.ticketPrice;
            const reservation = await reservation_model_1.Reservation.create({
                screeningId,
                userId,
                reservationDate: new Date(),
                status: "Confirmed",
                total,
            }, { transaction: t });
            const reservationSeatsData = seatInstances.map((s) => ({
                reservationId: reservation.idReservation,
                screeningId,
                seatId: s.idSeat,
            }));
            try {
                await reservation_seat_model_1.ReservationSeat.bulkCreate(reservationSeatsData, {
                    transaction: t,
                });
            }
            catch (err) {
                // If another transaction slipped through and inserted the same seat for
                // this screening, the unique index will raise a constraint error.
                if (err.name === 'SequelizeUniqueConstraintError') {
                    throw new Error('Some seats are already occupied');
                }
                throw err;
            }
            await t.commit();
            // Reload to include relations if needed, or return plain
            return reservation;
        }
        catch (error) {
            // rollback may already have happened; ignore failure
            try {
                await t.rollback();
            }
            catch (e) {
                // no-op
            }
            throw error;
        }
    }
    async updateReservation(reservationId, newSeats) {
        const t = await database_1.sequelize.transaction();
        try {
            const reservation = await reservation_model_1.Reservation.findByPk(reservationId, {
                include: ["screening", "reservationSeats"],
                transaction: t,
            });
            if (!reservation)
                throw new Error("Reservation not found");
            const screening = await screening_model_1.Screening.findByPk(reservation.screeningId, {
                transaction: t,
            });
            if (!screening)
                throw new Error("Screening not found");
            // 1. Resolve newSeats to Seat IDs
            const seatIds = [];
            for (const ns of newSeats) {
                const seat = await seat_model_1.Seat.findOne({
                    where: { roomId: screening.roomId, row: ns.row, column: ns.column },
                    transaction: t,
                });
                if (!seat)
                    throw new Error(`Seat ${ns.row}-${ns.column} not found in room`);
                seatIds.push(seat.idSeat);
            }
            // 2. Sync ReservationSeats
            // Current seats
            const currentReservationSeats = await reservation_seat_model_1.ReservationSeat.findAll({
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
                await reservation_seat_model_1.ReservationSeat.destroy({
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
                const occupied = await reservation_seat_model_1.ReservationSeat.findAll({
                    where: { seatId: toAdd },
                    include: [
                        {
                            model: reservation_model_1.Reservation,
                            where: {
                                screeningId: reservation.screeningId,
                                idReservation: { [sequelize_1.Op.ne]: reservationId }, // Exclude current reservation
                                status: { [sequelize_1.Op.or]: ["Pending", "Confirmed", "Paid"] },
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
                    await reservation_seat_model_1.ReservationSeat.bulkCreate(newEntries, { transaction: t });
                }
                catch (err) {
                    if (err.name === 'SequelizeUniqueConstraintError') {
                        throw new Error('Some new seats are already occupied');
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
            return (await this.getReservationById(reservationId));
        }
        catch (err) {
            // safe rollback
            try {
                await t.rollback();
            }
            catch (e) {
                // ignore if already finished
            }
            throw err;
        }
    }
    async cancelReservation(id) {
        const reservation = await reservation_model_1.Reservation.findByPk(id);
        if (!reservation)
            throw new Error("Reservation not found");
        reservation.status = "Canceled";
        await reservation.save();
    }
    async deleteReservation(id) {
        const t = await database_1.sequelize.transaction();
        try {
            // Delete associated seats first
            await reservation_seat_model_1.ReservationSeat.destroy({
                where: { reservationId: id },
                transaction: t,
            });
            // Delete the reservation
            const deleted = await reservation_model_1.Reservation.destroy({
                where: { idReservation: id },
                transaction: t,
            });
            if (deleted === 0) {
                throw new Error("Reservation not found");
            }
            await t.commit();
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
}
exports.BookingService = BookingService;
exports.default = new BookingService();
//# sourceMappingURL=booking.services.js.map