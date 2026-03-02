import { Router } from "express";
import {
  getBookings,
  createBooking,
  getAllBookingsAdmin,
  updateBooking,
  deleteBooking,
} from "../controllers/booking.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/bookings", authenticate, getBookings);
router.get("/bookings/admin", authenticate, getAllBookingsAdmin);
router.post("/bookings", authenticate, createBooking);
router.put("/bookings/:id", authenticate, updateBooking);
router.delete("/bookings/:id", authenticate, deleteBooking);

export default router;
