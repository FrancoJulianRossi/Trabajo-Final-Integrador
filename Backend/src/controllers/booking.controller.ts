import { Request, Response } from "express";
import ReservationService from "../services/reservation.service";

export class ReservationController {
  private reservationService: ReservationService;
  constructor() {
    this.reservationService = new ReservationService();
  }

  // Express handler: GET /reservation
  async listHandler(req: Request, res: Response): Promise<void> {
    try {
      const reservations = await this.reservationService.listReservations();
      res.status(200).json(reservations);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.status(500).json({ error: "Failed to list reservations" });
    }
  }

  // Express handler: POST /reservation
  async createHandler(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;

      // Basic validation: ensure screening and seat are present
      if (!body || typeof body !== "object") {
        res.status(400).json({ error: "Invalid payload" });
        return;
      }

      const created = await this.reservationService.createReservation(body);
      res.status(201).json(created);
    } catch (err: any) {
      // If the service throws a validation-like error, map to 400
      // otherwise 500
      // tslint:disable-next-line:no-console
      console.error(err);
      if (err && err.name === "ValidationError") {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: "Failed to create reservation" });
      }
    }
  }
}

// export an instance for convenience when wiring routes
export const reservationController = new ReservationController();

export default ReservationController;
