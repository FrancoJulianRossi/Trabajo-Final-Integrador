"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningEntity = void 0;
class ScreeningEntity {
    idScreening;
    date;
    start;
    end;
    ticketPrice;
    constructor(idScreening, date, start, end, ticketPrice) {
        this.idScreening = idScreening;
        this.date = new Date(date);
        this.start = new Date(start);
        this.end = new Date(end);
        this.ticketPrice = ticketPrice;
    }
    getIdScreening() {
        return this.idScreening;
    }
    getDate() {
        return this.date;
    }
    getStart() {
        return this.start;
    }
    getEnd() {
        return this.end;
    }
    getTicketPrice() {
        return this.ticketPrice;
    }
    getDurationMinutes() {
        const s = new Date(this.start).getTime();
        const e = new Date(this.end).getTime();
        return Math.max(0, Math.floor((e - s) / 60000));
    }
    isAvailable() {
        return Date.now() < new Date(this.start).getTime();
    }
}
exports.ScreeningEntity = ScreeningEntity;
//# sourceMappingURL=screening.entity.js.map