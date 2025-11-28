import { Router } from "express";
import { getBookings, createBooking } from "../controllers/booking.controller";

const router = Router();

router.get("/bookings", getBookings);
router.post("/bookings", createBooking);

export default router;
