"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const screening_controller_1 = require("../controllers/screening.controller");
const router = (0, express_1.Router)();
const screeningController = new screening_controller_1.ScreeningController();
router.get("/screenings", screeningController.getAllScreenings.bind(screeningController));
router.get("/screenings/:id", screeningController.getScreeningById.bind(screeningController));
router.get("/screenings/:id/seats", screeningController.getSeatsForScreening.bind(screeningController));
router.post("/screenings", screeningController.createScreening.bind(screeningController));
router.put("/screenings/:id", screeningController.updateScreening.bind(screeningController));
router.delete("/screenings/:id", screeningController.deleteScreening.bind(screeningController));
exports.default = router;
//# sourceMappingURL=screening.routes.js.map