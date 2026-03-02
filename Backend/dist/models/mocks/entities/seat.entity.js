"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seat = void 0;
class seat {
    id;
    row;
    column;
    constructor(id, row, column) {
        this.id = id;
        this.row = row;
        this.column = column;
    }
    getId() {
        return this.id;
    }
    getSeatPosition() {
        return `Row: ${this.row}, Column: ${this.column}`;
    }
}
exports.seat = seat;
//# sourceMappingURL=seat.entity.js.map