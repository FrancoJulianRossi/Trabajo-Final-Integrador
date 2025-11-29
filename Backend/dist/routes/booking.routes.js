"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("../controllers/booking.controller");
const router = (0, express_1.Router)();
router.get("/bookings", booking_controller_1.getBookings);
router.post("/bookings", booking_controller_1.createBooking);
exports.default = router;
//# sourceMappingURL=booking.routes.js.map