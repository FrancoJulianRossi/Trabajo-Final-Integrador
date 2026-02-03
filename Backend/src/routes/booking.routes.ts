import { Router } from "express";
import { getBookings, createBooking } from "../controllers/booking.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/bookings", authenticate, getBookings);
router.post("/bookings", authenticate, createBooking);

export default router;
