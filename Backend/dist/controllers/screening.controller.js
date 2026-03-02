"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningController = void 0;
const screening_services_1 = require("../services/screening.services");
class ScreeningController {
    screeningService;
    constructor() {
        this.screeningService = new screening_services_1.ScreeningService();
    }
    async getAllScreenings(req, res) {
        try {
            const { movieId } = req.query;
            const numMovieId = movieId ? Number(movieId) : undefined;
            const screenings = await this.screeningService.getScreenings(numMovieId);
            return res.status(200).json(screenings);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async getScreeningById(req, res) {
        const rawId = req.params?.id;
        if (!rawId)
            return res.status(400).json({ message: "Missing id param" });
        const id = Number(rawId);
        if (Number.isNaN(id))
            return res.status(400).json({ message: "Invalid id param" });
        try {
            const screening = await this.screeningService.getScreeningById(id);
            if (screening) {
                return res.status(200).json(screening);
            }
            else {
                return res.status(404).json({ message: "Screening not found" });
            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async createScreening(req, res) {
        try {
            const { idScreening, date, start, end, ticketPrice, movieId, roomId } = req.body;
            const createdScreening = await this.screeningService.createScreening({
                date,
                start,
                end,
                ticketPrice,
                movieId,
                roomId,
            });
            return res.status(201).json(createdScreening);
        }
        catch (error) {
            if (error.name === "ScreeningValidationError") {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    }
    async getSeatsForScreening(req, res) {
        const rawId = req.params?.id;
        if (!rawId)
            return res.status(400).json({ message: "Missing id param" });
        const id = Number(rawId);
        if (Number.isNaN(id))
            return res.status(400).json({ message: "Invalid id param" });
        try {
            const occupied = await this.screeningService.getOccupiedSeats(id);
            return res.status(200).json({ occupied });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async updateScreening(req, res) {
        const rawId = req.params?.id;
        if (!rawId)
            return res.status(400).json({ message: "Missing id param" });
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
                roomId,
            });
            if (result) {
                return res.status(200).json(result);
            }
            else {
                return res.status(404).json({ message: "Screening not found" });
            }
        }
        catch (error) {
            if (error.name === "ScreeningValidationError") {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    }
    async deleteScreening(req, res) {
        const rawId = req.params?.id;
        if (!rawId)
            return res.status(400).json({ message: "Missing id param" });
        const id = Number(rawId);
        if (Number.isNaN(id))
            return res.status(400).json({ message: "Invalid id param" });
        try {
            const success = await this.screeningService.deleteScreening(id);
            if (success) {
                return res
                    .status(200)
                    .json({ message: "Screening deleted successfully" });
            }
            else {
                return res.status(404).json({ message: "Screening not found" });
            }
        }
        catch (error) {
            if (error instanceof screening_services_1.ScreeningHasReservationsError) {
                return res.status(409).json({ message: error.message }); // 409 Conflict
            }
            return res.status(500).json({ message: error.message });
        }
    }
}
exports.ScreeningController = ScreeningController;
//# sourceMappingURL=screening.controller.js.map