"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningController = void 0;
const screening_entity_1 = require("../models/mocks/entities/screening.entity");
const screening_services_1 = require("../services/screening.services");
class ScreeningController {
    screeningService;
    constructor() {
        this.screeningService = new screening_services_1.ScreeningService();
    }
    async getAllScreenings(req, res) {
        const screenings = this.screeningService.getScreenings();
        return res.status(200).json(screenings);
    }
    async getScreeningById(req, res) {
        const rawId = req.params?.id;
        if (!rawId)
            return res.status(400).json({ message: "Missing id param" });
        const id = Number(rawId);
        if (Number.isNaN(id))
            return res.status(400).json({ message: "Invalid id param" });
        const screening = this.screeningService.getScreeningById(id);
        if (screening) {
            return res.status(200).json(screening);
        }
        else {
            return res.status(404).json({ message: "Screening not found" });
        }
    }
    async createScreening(req, res) {
        const { idScreening, date, start, end, ticketPrice } = req.body;
        const newScreening = new screening_entity_1.ScreeningEntity(idScreening, date, start, end, ticketPrice);
        const createdScreening = this.screeningService.createScreening(newScreening);
        return res.status(201).json(createdScreening);
    }
    async getSeatsForScreening(req, res) {
        const rawId = req.params?.id;
        if (!rawId)
            return res.status(400).json({ message: "Missing id param" });
        const id = Number(rawId);
        if (Number.isNaN(id))
            return res.status(400).json({ message: "Invalid id param" });
        const occupied = this.screeningService.getOccupiedSeats(id);
        return res.status(200).json({ occupied });
    }
    async updateScreening(req, res) {
        const rawId = req.params?.id;
        if (!rawId)
            return res.status(400).json({ message: "Missing id param" });
        const id = Number(rawId);
        if (Number.isNaN(id))
            return res.status(400).json({ message: "Invalid id param" });
        const { idScreening, date, start, end, ticketPrice } = req.body;
        const updatedScreening = new screening_entity_1.ScreeningEntity(idScreening, date, start, end, ticketPrice);
        const result = this.screeningService.updateScreening(id, updatedScreening);
        if (result) {
            return res.status(200).json(result);
        }
        else {
            return res.status(404).json({ message: "Screening not found" });
        }
    }
    async deleteScreening(req, res) {
        const rawId = req.params?.id;
        if (!rawId)
            return res.status(400).json({ message: "Missing id param" });
        const id = Number(rawId);
        if (Number.isNaN(id))
            return res.status(400).json({ message: "Invalid id param" });
        const success = this.screeningService.deleteScreening(id);
        if (success) {
            return res
                .status(200)
                .json({ message: "Screening deleted successfully" });
        }
        else {
            return res.status(404).json({ message: "Screening not found" });
        }
    }
}
exports.ScreeningController = ScreeningController;
//# sourceMappingURL=screening.controller.js.map