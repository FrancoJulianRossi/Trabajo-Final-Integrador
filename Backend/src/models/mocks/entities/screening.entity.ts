export class ScreeningEntity {
    protected idScreening: number;
    protected date: Date;
    protected start: Date;
    protected end: Date;
    protected ticketPrice: number;

    constructor(
        idScreening: number,
        date: Date | string,
        start: Date | string,
        end: Date | string,
        ticketPrice: number
    ) {
        this.idScreening = idScreening;
        this.date = new Date(date);
        this.start = new Date(start);
        this.end = new Date(end);
        this.ticketPrice = ticketPrice;
    }

    getIdScreening(): number {
        return this.idScreening;
    }
    getDate(): Date {
        return this.date;
    }
    getStart(): Date {
        return this.start;
    }
    getEnd(): Date {
        return this.end;
    }
    getTicketPrice(): number {
        return this.ticketPrice;
    }

    getDurationMinutes(): number {
        const s = new Date(this.start).getTime();
        const e = new Date(this.end).getTime();
        return Math.max(0, Math.floor((e - s) / 60000));
    }

    isAvailable(): boolean {
        return Date.now() < new Date(this.start).getTime();
    }
}