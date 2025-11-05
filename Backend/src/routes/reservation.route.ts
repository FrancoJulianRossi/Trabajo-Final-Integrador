import express, { Request, Response } from "express";
import { reservationController } from "../controllers/reservation.controller";

const router = express.Router();

// GET /reservation
router.get("/reservation", (req: Request, res: Response) =>
  reservationController.listHandler(req, res)
);

// POST /reservation
router.post("/reservation", (req: Request, res: Response) =>
  reservationController.createHandler(req, res)
);

export default router;
