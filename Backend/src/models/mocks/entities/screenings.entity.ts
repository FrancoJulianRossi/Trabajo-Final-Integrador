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

    toJSON(): Record<string, any> {
        return {
            idScreening: this.idScreening,
            date: this.date.toISOString(),
            start: this.start.toISOString(),
            end: this.end.toISOString(),
            ticketPrice: this.ticketPrice,
        };
    }
}

export const screeningsMock: ScreeningEntity[] = [
    new ScreeningEntity(
        1,
        new Date('2025-11-01'),
        new Date('2025-11-01T18:00:00'),
        new Date('2025-11-01T20:00:00'),
        350.0
    ),
    new ScreeningEntity(
        2,
        new Date('2025-11-01'),
        new Date('2025-11-01T21:00:00'),
        new Date('2025-11-01T23:00:00'),
        400.0
    ),
    new ScreeningEntity(
        3,
        new Date('2025-11-02'),
        new Date('2025-11-02T16:00:00'),
        new Date('2025-11-02T18:15:00'),
        300.0
    ),
];