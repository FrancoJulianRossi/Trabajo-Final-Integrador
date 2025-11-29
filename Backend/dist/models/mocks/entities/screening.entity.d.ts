export declare class ScreeningEntity {
    protected idScreening: number;
    protected date: Date;
    protected start: Date;
    protected end: Date;
    protected ticketPrice: number;
    constructor(idScreening: number, date: Date | string, start: Date | string, end: Date | string, ticketPrice: number);
    getIdScreening(): number;
    getDate(): Date;
    getStart(): Date;
    getEnd(): Date;
    getTicketPrice(): number;
    getDurationMinutes(): number;
    isAvailable(): boolean;
}
//# sourceMappingURL=screening.entity.d.ts.map