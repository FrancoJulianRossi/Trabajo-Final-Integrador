"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seats = void 0;
exports.seedSeats = seedSeats;
const seat_entity_1 = require("./entities/seat.entity");
exports.seats = [
    new seat_entity_1.seat(1, 1, 1),
    new seat_entity_1.seat(2, 1, 2),
    new seat_entity_1.seat(3, 1, 3),
    new seat_entity_1.seat(4, 1, 4),
    new seat_entity_1.seat(5, 1, 5),
    new seat_entity_1.seat(6, 2, 1),
    new seat_entity_1.seat(7, 2, 2),
    new seat_entity_1.seat(8, 2, 3),
    new seat_entity_1.seat(9, 2, 4),
    new seat_entity_1.seat(10, 2, 5),
];
function seedSeats(initial) {
    exports.seats = initial.map((s, idx) => new seat_entity_1.seat(s["id"] ?? idx + 1, s["row"] ?? 1, s["column"] ?? 1));
}
//# sourceMappingURL=seat.model.js.map