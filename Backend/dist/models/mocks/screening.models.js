"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.screenings = exports.screeningMockUpdated = exports.screeningMock = void 0;
exports.seedScreenings = seedScreenings;
const screening_entity_1 = require("./entities/screening.entity");
exports.screeningMock = new screening_entity_1.ScreeningEntity(1, new Date("2023-12-01"), new Date("2023-12-01T18:00:00"), new Date("2023-12-01T20:00:00"), 350.0);
exports.screeningMockUpdated = new screening_entity_1.ScreeningEntity(2, new Date("2023-12-02"), new Date("2023-12-02T18:00:00"), new Date("2023-12-02T20:00:00"), 350.0);
exports.screenings = [
    exports.screeningMock,
    exports.screeningMockUpdated,
];
function seedScreenings(initial) {
    exports.screenings = initial.map((s, idx) => new screening_entity_1.ScreeningEntity(s.getIdScreening ? s.getIdScreening() : s["idScreening"] || idx + 1, s.getDate(), s.getStart(), s.getEnd(), s.getTicketPrice()));
}
//# sourceMappingURL=screening.models.js.map