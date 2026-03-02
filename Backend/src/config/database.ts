import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { User } from "../models/user.model";
import { Movie } from "../models/movie.model";
import { Room } from "../models/room.model";
import { Seat } from "../models/seat.model";
import { Screening } from "../models/screening.model";
import { Reservation } from "../models/reservation.model";
import { ReservationSeat } from "../models/reservation-seat.model";

dotenv.config();

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test",
  port: Number(process.env.DB_PORT) || 3306,
  models: [User, Movie, Room, Seat, Screening, Reservation, ReservationSeat],
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
    await sequelize.sync({ alter: true }); 
    console.log("Database synchronized.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};