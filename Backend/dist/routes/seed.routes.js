"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movie_model_1 = require("../models/movie.model");
const user_model_1 = require("../models/user.model");
const room_model_1 = require("../models/room.model");
const seat_model_1 = require("../models/seat.model");
const screening_model_1 = require("../models/screening.model");
const reservation_model_1 = require("../models/reservation.model");
const reservation_seat_model_1 = require("../models/reservation-seat.model");
const carousel_model_1 = require("../models/carousel.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
router.post("/seed", async (req, res) => {
    try {
        // Clear data (order matters due to FKs)
        await reservation_seat_model_1.ReservationSeat.destroy({ where: {}, truncate: false });
        await reservation_model_1.Reservation.destroy({ where: {}, truncate: false });
        await screening_model_1.Screening.destroy({ where: {}, truncate: false });
        await seat_model_1.Seat.destroy({ where: {}, truncate: false });
        await room_model_1.Room.destroy({ where: {}, truncate: false });
        await movie_model_1.Movie.destroy({ where: {}, truncate: false });
        await user_model_1.User.destroy({ where: {}, truncate: false });
        await carousel_model_1.Carousel.destroy({ where: {}, truncate: false }); // Clear carousel data
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        // 1. Carousel Items
        const initialCarouselItems = [
            {
                title: "Estreno de Verano",
                subtitle: "No te pierdas nuestra nueva película",
                desktopImageUrl: `${baseUrl}/uploads/carousel/seed-banner-1.jpg`,
                link: "/movies/1",
                order: 1,
                isActive: true,
            },
            {
                title: "Oferta Especial",
                subtitle: "2x1 en entradas todos los martes",
                desktopImageUrl: `${baseUrl}/uploads/carousel/seed-banner-2.jpg`,
                link: "/offers/tuesday",
                order: 2,
                isActive: true,
            },
            {
                title: "Noche de Clásicos",
                subtitle: "Revive los clásicos en pantalla grande.",
                desktopImageUrl: `${baseUrl}/uploads/carousel/seed-banner-3.jpg`,
                link: "/cartelera",
                order: 3,
                isActive: false, // Este no estará activo inicialmente
            },
        ];
        await carousel_model_1.Carousel.bulkCreate(initialCarouselItems);
        // 2. Movies
        const movies = [
            {
                name: "Inception",
                length: 148,
                description: "Sueños dentro de sueños.",
                genre: "Ciencia ficción",
                categorie: "Estreno",
                director: "Christopher Nolan",
                lenguage: "Inglés",
                subtitles: true,
                poster: "https://via.placeholder.com/300x450/1a1a1a/FFD700?text=Inception",
            },
            {
                name: "Interstellar",
                length: 169,
                description: "Viaje espacial y relatividad.",
                genre: "Ciencia ficción",
                categorie: "Estreno",
                director: "Christopher Nolan",
                lenguage: "Inglés",
                subtitles: true,
                poster: "https://via.placeholder.com/300x450/1a1a1a/FFA500?text=Interstellar",
            },
            {
                name: "The Dark Knight",
                length: 152,
                description: "Batman enfrenta al Joker.",
                genre: "Acción",
                categorie: "Clásico",
                director: "Christopher Nolan",
                lenguage: "Inglés",
                subtitles: true,
                poster: "https://via.placeholder.com/300x450/1a1a1a/DC143C?text=Dark+Knight",
            },
            {
                name: "Pulp Fiction",
                length: 154,
                description: "Historias entrelazadas de crimen.",
                genre: "Crimen",
                categorie: "Clásico",
                director: "Quentin Tarantino",
                lenguage: "Inglés",
                subtitles: true,
                poster: "https://via.placeholder.com/300x450/1a1a1a/FF69B4?text=Pulp+Fiction",
            },
            {
                name: "The Matrix",
                length: 136,
                description: "Realidad simulada y revolución.",
                genre: "Ciencia ficción",
                categorie: "Clásico",
                director: "The Wachowskis",
                lenguage: "Inglés",
                subtitles: true,
                poster: "https://via.placeholder.com/300x450/1a1a1a/00FF00?text=The+Matrix",
            },
            {
                name: "Forrest Gump",
                length: 142,
                description: "Vida extraordinaria de un hombre común.",
                genre: "Drama",
                categorie: "Clásico",
                director: "Robert Zemeckis",
                lenguage: "Inglés",
                subtitles: true,
                poster: "https://via.placeholder.com/300x450/1a1a1a/87CEEB?text=Forrest+Gump",
            },
        ];
        const createdMovies = await movie_model_1.Movie.bulkCreate(movies);
        // 3. Rooms
        const rooms = [
            {
                name: "Sala 1",
                capacity: 40,
                type: "2D",
                rows: 5,
                cols: 8,
                isActive: true,
            },
            {
                name: "Sala 2",
                capacity: 60,
                type: "3D",
                rows: 6,
                cols: 10,
                isActive: true,
            },
        ];
        const createdRooms = await room_model_1.Room.bulkCreate(rooms);
        // 4. Seats
        const seatsData = [];
        for (const room of createdRooms) {
            for (let r = 1; r <= room.rows; r++) {
                for (let c = 1; c <= room.cols; c++) {
                    seatsData.push({
                        row: r,
                        column: c,
                        roomId: room.idRoom,
                        type: "Standard",
                    });
                }
            }
        }
        await seat_model_1.Seat.bulkCreate(seatsData);
        // 5. Users
        const users = [
            {
                name: "Admin",
                email: "admin@example.com",
                password: await bcryptjs_1.default.hash("admin", 10),
                role: true,
            },
            {
                name: "Client",
                email: "client@example.com",
                password: await bcryptjs_1.default.hash("client", 10),
                role: false,
            },
        ];
        await user_model_1.User.bulkCreate(users);
        // 6. Screenings
        if (createdMovies.length > 0 && createdRooms.length > 0) {
            const now = new Date();
            const screenings = [
                {
                    movieId: createdMovies[0].idMovie,
                    roomId: createdRooms[0].idRoom,
                    date: now,
                    start: new Date(now.getTime() + 3600000), // +1 hour
                    end: new Date(now.getTime() + 7200000), // +2 hours
                    ticketPrice: 350,
                },
                {
                    movieId: createdMovies[1].idMovie,
                    roomId: createdRooms[1].idRoom,
                    date: now,
                    start: new Date(now.getTime() + 10800000),
                    end: new Date(now.getTime() + 14400000),
                    ticketPrice: 400,
                },
            ];
            await screening_model_1.Screening.bulkCreate(screenings);
        }
        return res.status(200).json({ message: "Seed applied successfully" });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Seed failed", error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=seed.routes.js.map