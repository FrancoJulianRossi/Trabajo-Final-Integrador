"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rooms = void 0;
exports.seedRooms = seedRooms;
const room_entity_1 = require("./entities/room.entity");
exports.rooms = [
    new room_entity_1.Room(1, "Sala 1", 100, "2D"),
    new room_entity_1.Room(2, "Sala 2", 150, "3D"),
    new room_entity_1.Room(3, "Sala 3", 200, "IMAX"),
];
function seedRooms(initial) {
    exports.rooms = initial.map((r, idx) => new room_entity_1.Room(r.getId ? r.getId() : r["id"] || idx + 1, r.getName ? r.getName() : r["name"] || `Sala ${idx + 1}`, r.getCapacity ? r.getCapacity() : r["capacity"] || 100, r.getType ? r.getType() : r["type"] || "2D"));
}
//# sourceMappingURL=room.models.js.map