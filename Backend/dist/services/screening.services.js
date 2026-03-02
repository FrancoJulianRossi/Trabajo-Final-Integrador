"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningService = exports.ScreeningValidationError = exports.ScreeningHasReservationsError = void 0;
/*getScreeningById
getScreenings
createScreening
updateScreening
deleteScreening */
const screening_model_1 = require("../models/screening.model");
const movie_model_1 = require("../models/movie.model");
const reservation_model_1 = require("../models/reservation.model");
const reservation_seat_model_1 = require("../models/reservation-seat.model");
const seat_model_1 = require("../models/seat.model");
const sequelize_1 = require("sequelize");
class ScreeningHasReservationsError extends Error {
    constructor(message) {
        super(message);
        this.name = "ScreeningHasReservationsError";
    }
}
exports.ScreeningHasReservationsError = ScreeningHasReservationsError;
class ScreeningValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ScreeningValidationError";
    }
}
exports.ScreeningValidationError = ScreeningValidationError;
class ScreeningService {
    async getScreeningById(id) {
        return await screening_model_1.Screening.findByPk(id, { include: ["movie", "room"] });
    }
    async getScreenings(movieId) {
        const whereClause = {};
        if (movieId) {
            whereClause.movieId = movieId;
        }
        const result = await screening_model_1.Screening.findAll({
            where: whereClause,
            include: ["movie", "room"],
        });
        return result;
    }
    /**
     * Calculates the end time of a screening based on movie length and start time.
     * Mutates the provided `data` object to include `end` if possible.
     */
    /**
     * Combines a date string (YYYY-MM-DD) with a time string (HH:mm or full iso)
     * into a single Date object. If the `time` already contains a full date-time,
     * it is returned as-is. Returns `null` when the inputs are not parseable.
     */
    combineDateTime(date, time) {
        if (!time)
            return null;
        if (time instanceof Date) {
            return time;
        }
        // if the time string seems to include a date portion already, parse directly
        if (time.includes("T")) {
            const d = new Date(time);
            return isNaN(d.getTime()) ? null : d;
        }
        if (!date) {
            // fall back to parsing the time alone (will use today)
            const d = new Date(time);
            return isNaN(d.getTime()) ? null : d;
        }
        const dateStr = date instanceof Date ? date.toISOString().slice(0, 10) : date;
        const combined = new Date(`${dateStr}T${time}`);
        return isNaN(combined.getTime()) ? null : combined;
    }
    async computeEndTime(data) {
        // only compute if movieId and start are present and either end is missing or we
        // think it should be recalculated (start/movie changed)
        if (!data.movieId || !data.start)
            return;
        const movie = await movie_model_1.Movie.findByPk(data.movieId);
        if (!movie || typeof movie.length !== "number")
            return;
        const startDate = this.combineDateTime(data.date, data.start);
        if (!startDate)
            return;
        const endDate = new Date(startDate.getTime() + movie.length * 60 * 1000);
        data.end = endDate; // keep as Date for consistency with model
    }
    async validateTiming(data, excludeId) {
        // we need start, end, roomId and date to perform meaningful checks
        if (!data.start || !data.end || !data.roomId || !data.date)
            return;
        const startDate = this.combineDateTime(data.date, data.start);
        const endDate = this.combineDateTime(data.date, data.end);
        if (!startDate || !endDate)
            return;
        const now = new Date();
        // cannot schedule in the past
        if (startDate.getTime() < now.getTime()) {
            throw new ScreeningValidationError("Cannot schedule screening in the past");
        }
        // check for overlapping screenings in the same room and date
        const where = {
            roomId: data.roomId,
            date: data.date,
            start: { [sequelize_1.Op.lt]: endDate },
            end: { [sequelize_1.Op.gt]: startDate },
        };
        if (excludeId) {
            where.idScreening = { [sequelize_1.Op.ne]: excludeId };
        }
        const overlapping = await screening_model_1.Screening.findOne({ where });
        if (overlapping) {
            throw new ScreeningValidationError("Screening overlaps with another screening in the same room");
        }
    }
    async createScreening(data) {
        // price cannot be negative
        if (data.ticketPrice !== undefined && data.ticketPrice < 0) {
            throw new ScreeningValidationError("Ticket price must not be negative");
        }
        await this.computeEndTime(data);
        await this.validateTiming(data);
        return await screening_model_1.Screening.create(data);
    }
    async updateScreening(id, data) {
        const screening = await screening_model_1.Screening.findByPk(id);
        if (!screening)
            return null;
        // if start time or movie changed we should recalc end.
        if (data.start || data.movieId) {
            // merge old values so computeEndTime has what it needs
            const merged = {
                movieId: data.movieId ?? screening.movieId,
                start: data.start ?? screening.start,
            };
            await this.computeEndTime(merged);
            if (merged.end) {
                data.end = merged.end;
            }
        }
        // price cannot be negative
        if (data.ticketPrice !== undefined && data.ticketPrice < 0) {
            throw new ScreeningValidationError("Ticket price must not be negative");
        }
        // build final object for validation using existing values when not provided
        const finalData = {
            movieId: data.movieId ?? screening.movieId,
            roomId: data.roomId ?? screening.roomId,
            date: data.date ?? screening.date,
            start: data.start ?? screening.start,
            end: data.end ?? screening.end,
        };
        await this.validateTiming(finalData, id);
        return await screening.update(data);
    }
    async deleteScreening(id) {
        // Check for existing active reservations
        const activeReservationsCount = await reservation_model_1.Reservation.count({
            where: {
                screeningId: id,
                status: {
                    [sequelize_1.Op.notIn]: ["Canceled"], // Assuming "Canceled" status means it's not an obstacle
                },
            },
        });
        if (activeReservationsCount > 0) {
            throw new ScreeningHasReservationsError("Cannot delete screening: it has active reservations.");
        }
        const count = await screening_model_1.Screening.destroy({ where: { idScreening: id } });
        return count > 0;
    }
    async getOccupiedSeats(screeningId) {
        const reservations = await reservation_model_1.Reservation.findAll({
            where: {
                screeningId,
                status: { [sequelize_1.Op.ne]: "Canceled" },
            },
            include: [
                {
                    model: reservation_seat_model_1.ReservationSeat,
                    include: [seat_model_1.Seat],
                },
            ],
        });
        const occupied = [];
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
exports.ScreeningService = ScreeningService;
//# sourceMappingURL=screening.services.js.map