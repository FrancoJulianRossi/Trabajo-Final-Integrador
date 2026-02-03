import { Router, Request, Response } from "express";
import { Movie } from "../models/movie.model";
import { User } from "../models/user.model";
import { Room } from "../models/room.model";
import { Seat } from "../models/seat.model";
import { Screening } from "../models/screening.model";
import { Reservation } from "../models/reservation.model";
import { ReservationSeat } from "../models/reservation-seat.model";
import bcrypt from "bcryptjs";

const router = Router();

router.post("/seed", async (req: Request, res: Response) => {
  try {
    // Clear data (order matters due to FKs)
    await ReservationSeat.destroy({ where: {}, truncate: false });
    await Reservation.destroy({ where: {}, truncate: false });
    await Screening.destroy({ where: {}, truncate: false });
    await Seat.destroy({ where: {}, truncate: false });
    await Room.destroy({ where: {}, truncate: false });
    await Movie.destroy({ where: {}, truncate: false });
    await User.destroy({ where: {}, truncate: false });

    // 1. Movies
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
        poster: "https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SL1500_.jpg",
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
        poster: "",
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
        poster: "https://m.media-amazon.com/images/I/51EbJjlY3rL._AC_.jpg",
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
        poster: "https://m.media-amazon.com/images/I/71c05lTE03L._AC_SL1024_.jpg",
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
        poster: "https://m.media-amazon.com/images/I/51EG732BV3L._AC_.jpg",
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
        poster: "https://m.media-amazon.com/images/I/61+o+R8KJDL._AC_SL1024_.jpg",
      },
    ];
    const createdMovies = await Movie.bulkCreate(movies);

    // 2. Rooms
    const rooms = [
      { name: "Sala 1", capacity: 40, type: "2D" },
      { name: "Sala 2", capacity: 60, type: "3D" },
    ];
    const createdRooms = await Room.bulkCreate(rooms);

    // 3. Seats
    const seatsData = [];
    for (const room of createdRooms) {
      // Create a grid of seats based on capacity (approx)
      const rows = 5;
      const cols = Math.ceil(room.capacity / rows);
      for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
          if (seatsData.length < room.capacity + (room.idRoom - 1) * 1000) { // check limit logic? Just fill grid
             seatsData.push({ row: r, column: c, roomId: room.idRoom });
          }
        }
      }
    }
    await Seat.bulkCreate(seatsData);

    // 4. Users
    const users = [
      {
        name: "Admin",
        email: "admin@example.com",
        password: await bcrypt.hash("admin", 10),
        role: true,
      },
      {
        name: "Client",
        email: "client@example.com",
        password: await bcrypt.hash("client", 10),
        role: false,
      },
    ];
    await User.bulkCreate(users);

    // 5. Screenings
    if (createdMovies.length > 0 && createdRooms.length > 0) {
      const now = new Date();
      const screenings = [
        {
          movieId: createdMovies[0]!.idMovie,
          roomId: createdRooms[0]!.idRoom,
          date: now,
          start: new Date(now.getTime() + 3600000), // +1 hour
          end: new Date(now.getTime() + 7200000),   // +2 hours
          ticketPrice: 350,
        },
        {
          movieId: createdMovies[1]!.idMovie,
          roomId: createdRooms[1]!.idRoom,
          date: now,
          start: new Date(now.getTime() + 10800000),
          end: new Date(now.getTime() + 14400000),
          ticketPrice: 400,
        },
      ];
      await Screening.bulkCreate(screenings);
    }

    return res.status(200).json({ message: "Seed applied successfully" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Seed failed", error: error.message });
  }
});

export default router;