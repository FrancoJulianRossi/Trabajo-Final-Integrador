import { Request, Response } from "express";
import bookingService from "../services/booking.services";

export const getBookings = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.idUser;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const reservations = await bookingService.listReservationsByUser(userId);
    return res.status(200).json(reservations);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllBookingsAdmin = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; // Ensure user is authenticated, though not for filtering
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const reservations = await bookingService.listAllReservations();
    return res.status(200).json(reservations);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  const { screening, seats, userId: requestedUserId } = req.body;
  const user = (req as any).user;

  if (!screening || !seats) {
    return res.status(400).json({ message: "Missing screening or seats" });
  }

  // Determine which user to attribute this booking to. Admin users may specify a different
  // userId in the request body; regular users are limited to their own id.
  let userId: number | undefined = user?.idUser;
  const isAdmin =
    user &&
    (String(user.role).toLowerCase() === "admin" || user.role === true);
  if (isAdmin && requestedUserId) {
    userId = requestedUserId;
  }

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const screeningId = screening.idScreening;

  try {
    const created = await bookingService.createReservation(
      screeningId,
      userId,
      seats, // Expects {row, column}[]
    );
    return res.status(201).json(created);
  } catch (err: any) {
    if (!err) {
      return res.status(500).json({ message: "Unknown error" });
    }

    if (err.message && err.message.includes("occupied")) {
      return res.status(409).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message || "Unknown error" });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { seats } = req.body; // Expecting { row, column }[]

  if (!seats || !Array.isArray(seats)) {
    return res.status(400).json({ message: "Invalid seats data" });
  }

  try {
    const updated = await bookingService.updateReservation(Number(id), seats);
    return res.json(updated);
  } catch (err: any) {
    if (err.message && err.message.includes("occupied")) {
      return res.status(409).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message || "Unknown error" });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await bookingService.deleteReservation(Number(id));
    return res.status(204).send();
  } catch (err: any) {
    if (err.message === "Reservation not found") {
      return res.status(404).json({ message: "Reservation not found" });
    }
    return res.status(500).json({ message: err.message || "Unknown error" });
  }
};
