"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const booking_services_1 = __importDefault(require("./booking.services"));
const database_1 = require("../config/database");
const user_model_1 = require("../models/user.model");
const room_model_1 = require("../models/room.model");
const seat_model_1 = require("../models/seat.model");
const movie_model_1 = require("../models/movie.model");
const screening_model_1 = require("../models/screening.model");
describe('BookingService transactional booking', () => {
    let user;
    let room;
    let seat;
    let movie;
    let screening;
    beforeAll(async () => {
        // force-create fresh schema so that new index/column is present
        await database_1.sequelize.sync({ force: true });
    });
    beforeEach(async () => {
        // clear existing data by forcing sync; maintains schema including indexes
        await database_1.sequelize.sync({ force: true });
        user = await user_model_1.User.create({
            name: 'test',
            email: 'user@example.com',
            password: 'secret',
        });
        room = await room_model_1.Room.create({
            name: 'Room1',
            capacity: 10,
            type: 'Standard',
            rows: 2,
            cols: 5,
            isActive: true,
        });
        seat = await seat_model_1.Seat.create({
            roomId: room.idRoom,
            row: 1,
            column: 1,
            type: 'Standard',
        });
        movie = await movie_model_1.Movie.create({
            name: 'Some Movie',
            length: 90,
            description: 'desc',
            genre: 'Action',
            categorie: 'A',
            director: 'D',
            lenguage: 'EN',
            subtitles: false,
        });
        screening = await screening_model_1.Screening.create({
            movieId: movie.idMovie,
            roomId: room.idRoom,
            date: new Date(),
            start: new Date(),
            end: new Date(),
            ticketPrice: 5,
        });
    });
    it('should create a reservation and reject a second for same seat', async () => {
        const first = await booking_services_1.default.createReservation(screening.idScreening, user.idUser, [{ row: 1, column: 1 }]);
        expect(first).toBeDefined();
        await expect(booking_services_1.default.createReservation(screening.idScreening, user.idUser, [{ row: 1, column: 1 }])).rejects.toThrow(/occupied/);
    });
    it('should only allow one of two concurrent attempts', async () => {
        const p1 = booking_services_1.default.createReservation(screening.idScreening, user.idUser, [{ row: 1, column: 1 }]);
        const p2 = booking_services_1.default.createReservation(screening.idScreening, user.idUser, [{ row: 1, column: 1 }]);
        const results = await Promise.allSettled([p1, p2]);
        const successes = results.filter((r) => r.status === 'fulfilled');
        const failures = results.filter((r) => r.status === 'rejected');
        expect(successes.length).toBe(1);
        expect(failures.length).toBe(1);
        const reason = failures[0].reason;
        expect(reason).toBeInstanceOf(Error);
        // some databases might return deadlock instead of custom message when
        // two requests collide; allow either text so tests are robust.
        expect(reason.message).toMatch(/occupied|Deadlock/);
    });
});
//# sourceMappingURL=booking.services.test.js.map