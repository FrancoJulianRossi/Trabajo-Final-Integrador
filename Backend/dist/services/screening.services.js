"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningService = void 0;
/*getScreeningById
getScreenings
createScreening
updateScreening
deleteScreening */
const screening_models_1 = require("../models/mocks/screening.models");
const screening_entity_1 = require("../models/mocks/entities/screening.entity");
const reservation_models_1 = __importDefault(require("../models/mocks/reservation.models"));
class ScreeningService {
    screenings;
    constructor() {
        // seed with available mocks
        this.screenings = [screening_models_1.screeningMock, screening_models_1.screeningMockUpdated];
    }
    getScreeningById(id) {
        return this.screenings.find((s) => s.getIdScreening() === id) || null;
    }
    getScreenings() {
        return [...this.screenings];
    }
    createScreening(screening) {
        const newId = this.screenings.length
            ? Math.max(...this.screenings.map((s) => s.getIdScreening())) + 1
            : 1;
        const newScreening = new screening_entity_1.ScreeningEntity(newId, screening.getDate(), screening.getStart(), screening.getEnd(), screening.getTicketPrice());
        this.screenings.push(newScreening);
        return newScreening;
    }
    updateScreening(id, screening) {
        const idx = this.screenings.findIndex((s) => s.getIdScreening() === id);
        if (idx === -1)
            return null;
        const updated = new screening_entity_1.ScreeningEntity(id, screening.getDate(), screening.getStart(), screening.getEnd(), screening.getTicketPrice());
        this.screenings[idx] = updated;
        return updated;
    }
    deleteScreening(id) {
        const initial = this.screenings.length;
        this.screenings = this.screenings.filter((s) => s.getIdScreening() !== id);
        return this.screenings.length < initial;
    }
    getOccupiedSeats(screeningId) {
        const reservations = reservation_models_1.default.getReservations();
        const occupied = [];
        for (const r of reservations) {
            const scr = r.getScreening();
            if (scr &&
                typeof scr.getIdScreening === "function" &&
                scr.getIdScreening() === screeningId) {
                const seats = r.getSeat();
                for (const s of seats) {
                    occupied.push({
                        row: s.row ?? 0,
                        column: s.column ?? 0,
                    });
                }
            }
        }
        return occupied;
    }
}
exports.ScreeningService = ScreeningService;
//# sourceMappingURL=screening.services.js.map