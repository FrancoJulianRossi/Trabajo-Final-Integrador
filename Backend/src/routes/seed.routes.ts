import { Router, Request, Response } from "express";
import MoviesModel from "../models/mocks/movie.models";
import { seedRooms } from "../models/mocks/room.models";
import { seedScreenings } from "../models/mocks/screening.models";
import { seedSeats } from "../models/mocks/seat.model";
import ReservationMock from "../models/mocks/reservation.models";
import UserMock, { seedUsers } from "../models/mocks/user.models";
import bcrypt from "bcryptjs";
import { Movie } from "../models/mocks/entities/movie.entity";
import { Room } from "../models/mocks/entities/room.entity";
import { ScreeningEntity } from "../models/mocks/entities/screening.entity";
import { seat } from "../models/mocks/entities/seat.entity";

const router = Router();

router.post("/seed", async (req: Request, res: Response) => {
  // Example seed data
  const movies = [
    new Movie(
      1,
      "Inception",
      148,
      "Sueños dentro de sueños.",
      "Ciencia ficción",
      "Estreno",
      "Christopher Nolan",
      "Inglés",
      true,
      "https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SL1500_.jpg"
    ),
    new Movie(
      2,
      "Interstellar",
      169,
      "Viaje espacial y relatividad.",
      "Ciencia ficción",
      "Estreno",
      "Christopher Nolan",
      "Inglés",
      true,
      ""
    ),
    new Movie(
      3,
      "The Dark Knight",
      152,
      "Batman enfrenta al Joker.",
      "Acción",
      "Clásico",
      "Christopher Nolan",
      "Inglés",
      true,
      "https://m.media-amazon.com/images/I/51EbJjlY3rL._AC_.jpg"
    ),
    new Movie(
      4,
      "Pulp Fiction",
      154,
      "Historias entrelazadas de crimen.",
      "Crimen",
      "Clásico",
      "Quentin Tarantino",
      "Inglés",
      true,
      "https://m.media-amazon.com/images/I/71c05lTE03L._AC_SL1024_.jpg"
    ),
    new Movie(
      5,
      "The Matrix",
      136,
      "Realidad simulada y revolución.",
      "Ciencia ficción",
      "Clásico",
      "The Wachowskis",
      "Inglés",
      true,
      "https://m.media-amazon.com/images/I/51EG732BV3L._AC_.jpg"
    ),
    new Movie(
      6,
      "Forrest Gump",
      142,
      "Vida extraordinaria de un hombre común.",
      "Drama",  
      "Clásico",
      "Robert Zemeckis",
      "Inglés", 
      true,
      "https://m.media-amazon.com/images/I/61+o+R8KJDL._AC_SL1024_.jpg"
    ),

  ];
  MoviesModel.seed(movies as any);

  const rooms = [
    new Room(1, "Sala 1", 40, "2D"),
    new Room(2, "Sala 2", 60, "3D"),
  ];
  seedRooms(rooms as any);

  const screenings = [
    new ScreeningEntity(
      1,
      new Date(),
      new Date(),
      new Date(Date.now() + 3600000),
      120
    ),
    new ScreeningEntity(
      2,
      new Date(),
      new Date(Date.now() + 7200000),
      new Date(Date.now() + 10800000),
      150
    ),
  ];
  seedScreenings(screenings as any);

  const seats = [
    new seat(1, 1, 1),
    new seat(2, 1, 2),
    new seat(3, 1, 3),
    new seat(4, 1, 4),
    new seat(5, 1, 5),
  ];
  seedSeats(seats as any);

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
  const usersHashed = await Promise.all(
    users.map(async (u: any) => ({
      ...u,
      password: await bcrypt.hash(u.password, 10),
    }))
  );
  seedUsers(usersHashed as any);

  // reset reservations to empty
  ReservationMock.seed([] as any);

  return res.status(200).json({ message: "Seed applied" });
});

export default router;