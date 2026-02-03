import { Request, Response } from "express";
import { ScreeningService } from "../services/screening.services";

export class ScreeningController {
  private screeningService: ScreeningService;
  constructor() {
    this.screeningService = new ScreeningService();
  }

  async getAllScreenings(req: Request, res: Response): Promise<Response> {
    try {
      const screenings = await this.screeningService.getScreenings();
      return res.status(200).json(screenings);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getScreeningById(req: Request, res: Response): Promise<Response> {
    const rawId = req.params?.id;
    if (!rawId) return res.status(400).json({ message: "Missing id param" });
    const id = Number(rawId);
    if (Number.isNaN(id))
      return res.status(400).json({ message: "Invalid id param" });
    
    try {
      const screening = await this.screeningService.getScreeningById(id);
      if (screening) {
        return res.status(200).json(screening);
      } else {
        return res.status(404).json({ message: "Screening not found" });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async createScreening(req: Request, res: Response): Promise<Response> {
    try {
      const { idScreening, date, start, end, ticketPrice, movieId, roomId } = req.body;
      const createdScreening = await this.screeningService.createScreening({
        date,
        start,
        end,
        ticketPrice,
        movieId,
        roomId
      });
      return res.status(201).json(createdScreening);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getSeatsForScreening(req: Request, res: Response): Promise<Response> {
    const rawId = req.params?.id;
    if (!rawId) return res.status(400).json({ message: "Missing id param" });
    const id = Number(rawId);
    if (Number.isNaN(id))
      return res.status(400).json({ message: "Invalid id param" });
    
    try {
      const occupied = await this.screeningService.getOccupiedSeats(id);
      return res.status(200).json({ occupied });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateScreening(req: Request, res: Response): Promise<Response> {
    const rawId = req.params?.id;
    if (!rawId) return res.status(400).json({ message: "Missing id param" });
    const id = Number(rawId);
    if (Number.isNaN(id))
      return res.status(400).json({ message: "Invalid id param" });
    
    try {
      const { date, start, end, ticketPrice, movieId, roomId } = req.body;
      const result = await this.screeningService.updateScreening(id, {
        date,
        start,
        end,
        ticketPrice,
        movieId,
        roomId
      });
      if (result) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ message: "Screening not found" });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteScreening(req: Request, res: Response): Promise<Response> {
    const rawId = req.params?.id;
    if (!rawId) return res.status(400).json({ message: "Missing id param" });
    const id = Number(rawId);
    if (Number.isNaN(id))
      return res.status(400).json({ message: "Invalid id param" });
    
    try {
      const success = await this.screeningService.deleteScreening(id);
      if (success) {
        return res
          .status(200)
          .json({ message: "Screening deleted successfully" });
      } else {
        return res.status(404).json({ message: "Screening not found" });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}