import { Request, Response } from "express";
import bookingService from "../services/booking.services";
import { ScreeningEntity } from "../models/mocks/entities/screening.entity";
import { seat } from "../models/mocks/entities/seat.entity";

export const getBookings = (req: Request, res: Response) => {
  const reservations = bookingService.listReservations();
  return res.status(200).json(reservations);
};

export const createBooking = async (req: Request, res: Response) => {
  const { screening, seats } = req.body;

  if (!screening || !seats) {
    return res.status(400).json({ message: "Missing screening or seats" });
  }

  const screeningEntity = new ScreeningEntity(
    screening.idScreening ?? 0,
    screening.date,
    screening.start,
    screening.end,
    screening.ticketPrice ?? 0
  );

  const seatEntities: seat[] = Array.isArray(seats)
    ? seats.map(
        (s: any, idx: number) =>
          new seat(s.id ?? idx + 1, s.row ?? 1, s.column ?? 1)
      )
    : [];

  try {
    const created = await bookingService.createReservation(
      screeningEntity,
      seatEntities
    );
    return res.status(201).json(created);
  } catch (err: any) {
    if (!err) {
      return res.status(500).json({ message: "Unknown error" });
    }

    if (err.message && err.message.startsWith("Seat already occupied")) {
      return res.status(409).json({ message: err.message });
    }

    if (err.message && err.message.includes("locked")) {
      return res.status(423).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message || "Unknown error" });
  }
};
