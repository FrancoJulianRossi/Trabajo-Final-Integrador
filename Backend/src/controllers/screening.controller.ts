import { Request, Response } from "express";
import { ScreeningEntity } from "../models/mocks/entities/screening.entity";
import { screeningMock } from "../models/mocks/screening.models";
import { ScreeningService } from "../services/screening.services";

export class ScreeningController {
  private screeningService: ScreeningService;
  constructor() {
    this.screeningService = new ScreeningService();
  }

  async getAllScreenings(req: Request, res: Response): Promise<Response> {
    const screenings = this.screeningService.getScreenings();
    return res.status(200).json(screenings);
  }

  async getScreeningById(req: Request, res: Response): Promise<Response> {
    const rawId = req.params?.id;
    if (!rawId) return res.status(400).json({ message: "Missing id param" });
    const id = Number(rawId);
    if (Number.isNaN(id))
      return res.status(400).json({ message: "Invalid id param" });
    const screening = this.screeningService.getScreeningById(id);
    if (screening) {
      return res.status(200).json(screening);
    } else {
      return res.status(404).json({ message: "Screening not found" });
    }
  }

  async createScreening(req: Request, res: Response): Promise<Response> {
    const { idScreening, date, start, end, ticketPrice } = req.body;
    const newScreening = new ScreeningEntity(
      idScreening,
      date,
      start,
      end,
      ticketPrice
    );
    const createdScreening =
      this.screeningService.createScreening(newScreening);
    return res.status(201).json(createdScreening);
  }
  async getSeatsForScreening(req: Request, res: Response): Promise<Response> {
    const rawId = req.params?.id;
    if (!rawId) return res.status(400).json({ message: "Missing id param" });
    const id = Number(rawId);
    if (Number.isNaN(id))
      return res.status(400).json({ message: "Invalid id param" });
    const occupied = this.screeningService.getOccupiedSeats(id);
    return res.status(200).json({ occupied });
  }
  async updateScreening(req: Request, res: Response): Promise<Response> {
    const rawId = req.params?.id;
    if (!rawId) return res.status(400).json({ message: "Missing id param" });
    const id = Number(rawId);
    if (Number.isNaN(id))
      return res.status(400).json({ message: "Invalid id param" });
    const { idScreening, date, start, end, ticketPrice } = req.body;
    const updatedScreening = new ScreeningEntity(
      idScreening,
      date,
      start,
      end,
      ticketPrice
    );
    const result = this.screeningService.updateScreening(id, updatedScreening);
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Screening not found" });
    }
  }
  async deleteScreening(req: Request, res: Response): Promise<Response> {
    const rawId = req.params?.id;
    if (!rawId) return res.status(400).json({ message: "Missing id param" });
    const id = Number(rawId);
    if (Number.isNaN(id))
      return res.status(400).json({ message: "Invalid id param" });
    const success = this.screeningService.deleteScreening(id);
    if (success) {
      return res
        .status(200)
        .json({ message: "Screening deleted successfully" });
    } else {
      return res.status(404).json({ message: "Screening not found" });
    }
  }
}