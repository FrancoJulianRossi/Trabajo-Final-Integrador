"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movie_models_1 = __importDefault(require("../models/mocks/movie.models"));
const room_models_1 = require("../models/mocks/room.models");
const screening_models_1 = require("../models/mocks/screening.models");
const seat_model_1 = require("../models/mocks/seat.model");
const reservation_models_1 = __importDefault(require("../models/mocks/reservation.models"));
const user_models_1 = require("../models/mocks/user.models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const movie_entity_1 = require("../models/mocks/entities/movie.entity");
const room_entity_1 = require("../models/mocks/entities/room.entity");
const screening_entity_1 = require("../models/mocks/entities/screening.entity");
const seat_entity_1 = require("../models/mocks/entities/seat.entity");
const router = (0, express_1.Router)();
router.post("/seed", async (req, res) => {
    // Example seed data
    const movies = [
        new movie_entity_1.Movie(1, "Inception", 148, "Sueños dentro de sueños.", "Ciencia ficción", "Estreno", "Christopher Nolan", "Inglés", true, "https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SL1500_.jpg"),
        new movie_entity_1.Movie(2, "Interstellar", 169, "Viaje espacial y relatividad.", "Ciencia ficción", "Estreno", "Christopher Nolan", "Inglés", true, ""),
        new movie_entity_1.Movie(3, "The Dark Knight", 152, "Batman enfrenta al Joker.", "Acción", "Clásico", "Christopher Nolan", "Inglés", true, "https://m.media-amazon.com/images/I/51EbJjlY3rL._AC_.jpg"),
        new movie_entity_1.Movie(4, "Pulp Fiction", 154, "Historias entrelazadas de crimen.", "Crimen", "Clásico", "Quentin Tarantino", "Inglés", true, "https://m.media-amazon.com/images/I/71c05lTE03L._AC_SL1024_.jpg"),
        new movie_entity_1.Movie(5, "The Matrix", 136, "Realidad simulada y revolución.", "Ciencia ficción", "Clásico", "The Wachowskis", "Inglés", true, "https://m.media-amazon.com/images/I/51EG732BV3L._AC_.jpg"),
        new movie_entity_1.Movie(6, "Forrest Gump", 142, "Vida extraordinaria de un hombre común.", "Drama", "Clásico", "Robert Zemeckis", "Inglés", true, "https://m.media-amazon.com/images/I/61+o+R8KJDL._AC_SL1024_.jpg"),
    ];
    movie_models_1.default.seed(movies);
    const rooms = [
        new room_entity_1.Room(1, "Sala 1", 40, "2D"),
        new room_entity_1.Room(2, "Sala 2", 60, "3D"),
    ];
    (0, room_models_1.seedRooms)(rooms);
    const screenings = [
        new screening_entity_1.ScreeningEntity(1, new Date(), new Date(), new Date(Date.now() + 3600000), 120),
        new screening_entity_1.ScreeningEntity(2, new Date(), new Date(Date.now() + 7200000), new Date(Date.now() + 10800000), 150),
    ];
    (0, screening_models_1.seedScreenings)(screenings);
    const seats = [
        new seat_entity_1.seat(1, 1, 1),
        new seat_entity_1.seat(2, 1, 2),
        new seat_entity_1.seat(3, 1, 3),
        new seat_entity_1.seat(4, 1, 4),
        new seat_entity_1.seat(5, 1, 5),
    ];
    (0, seat_model_1.seedSeats)(seats);
    const users = [
        {
            idUser: 1,
            name: "Admin",
            email: "admin@example.com",
            password: "admin",
            role: true,
        },
        {
            idUser: 2,
            name: "Client",
            email: "client@example.com",
            password: "client",
            role: false,
        },
    ];
    // Hash passwords before seeding
    const usersHashed = await Promise.all(users.map(async (u) => ({
        ...u,
        password: await bcryptjs_1.default.hash(u.password, 10),
    })));
    (0, user_models_1.seedUsers)(usersHashed);
    // reset reservations to empty
    reservation_models_1.default.seed([]);
    return res.status(200).json({ message: "Seed applied" });
});
exports.default = router;
//# sourceMappingURL=seed.routes.js.map