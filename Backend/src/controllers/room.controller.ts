import { Request, Response } from "express";
import { RoomService } from "../services/room.services";
import { Room } from "../models/room.model";

export class RoomController {
  private roomService: RoomService;
  constructor() {
    this.roomService = new RoomService();
  }

  async getAllRooms(req: Request, res: Response): Promise<Response> {
    try {
      const rooms = await this.roomService.getAllRooms();
      return res.status(200).json(rooms);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getRoomById(req: Request, res: Response): Promise<Response> {
    const rawId = req.params?.id;
    if (!rawId) return res.status(400).json({ message: "Missing id param" });
    const id = Number(rawId);
    if (Number.isNaN(id))
      return res.status(400).json({ message: "Invalid id param" });

    try {
      const room = await this.roomService.getRoomById(id);
      if (room) {
        return res.status(200).json(room);
      } else {
        return res.status(404).json({ message: "Room not found" });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getRoomSeats(req: Request, res: Response): Promise<Response> {
    const rawId = req.params?.id;
    if (!rawId) return res.status(400).json({ message: "Missing id param" });
    const id = Number(rawId);
    if (Number.isNaN(id))
      return res.status(400).json({ message: "Invalid id param" });

    try {
      const seats = await this.roomService.getRoomSeats(id);
      return res.status(200).json(seats);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async createRoom(req: Request, res: Response): Promise<Response> {
    try {
      const { name, type, rows, cols, seats } = req.body;
      const room = await this.roomService.createRoom({
        name,
        type,
        rows: Number(rows),
        cols: Number(cols),
        seats,
      });
      return res.status(201).json(room);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateRoom(req: Request, res: Response): Promise<Response> {
    const rawId = req.params?.id;
    if (!rawId) return res.status(400).json({ message: "Missing id param" });
    const id = Number(rawId);
    if (Number.isNaN(id))
      return res.status(400).json({ message: "Invalid id param" });

    try {
      const { name, type, rows, cols, seats } = req.body;

      const payload: Partial<Room> & { seats?: any } = {};
      if (name) payload.name = name;
      if (type) payload.type = type;
      if (seats) payload.seats = seats;
      if (rows) payload.rows = Number(rows);
      if (cols) payload.cols = Number(cols);

      const result = await this.roomService.updateRoom(id, payload);

      if (result) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ message: "Room not found" });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteRoom(req: Request, res: Response): Promise<Response> {
    const rawId = req.params?.id;
    if (!rawId) return res.status(400).json({ message: "Missing id param" });
    const id = Number(rawId);
    if (Number.isNaN(id))
      return res.status(400).json({ message: "Invalid id param" });

    try {
      const success = await this.roomService.deleteRoom(id);
      if (success) {
        return res.status(200).json({ message: "Room deleted successfully" });
      } else {
        return res.status(404).json({ message: "Room not found" });
      }
    } catch (error: any) {
      if (
        error.message &&
        error.message.toLowerCase().includes("screenings")
      ) {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }
}