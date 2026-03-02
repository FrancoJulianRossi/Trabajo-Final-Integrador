"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
class Room {
    id;
    name;
    capacity;
    type;
    constructor(id, name, capacity, type) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.type = type;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getCapacity() {
        return this.capacity;
    }
    getType() {
        return this.type;
    }
    setName(name) {
        this.name = name;
    }
    setCapacity(capacity) {
        this.capacity = capacity;
    }
    setType(type) {
        this.type = type;
    }
    isFull(currentOccupancy) {
        return currentOccupancy >= this.capacity;
    }
}
exports.Room = Room;
//# sourceMappingURL=room.entity.js.map