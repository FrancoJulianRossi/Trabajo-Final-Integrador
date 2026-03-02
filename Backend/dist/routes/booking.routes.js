"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("../controllers/booking.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/bookings", auth_middleware_1.authenticate, booking_controller_1.getBookings);
router.get("/bookings/admin", auth_middleware_1.authenticate, booking_controller_1.getAllBookingsAdmin);
router.post("/bookings", auth_middleware_1.authenticate, booking_controller_1.createBooking);
router.put("/bookings/:id", auth_middleware_1.authenticate, booking_controller_1.updateBooking);
router.delete("/bookings/:id", auth_middleware_1.authenticate, booking_controller_1.deleteBooking);
exports.default = router;
//# sourceMappingURL=booking.routes.js.map