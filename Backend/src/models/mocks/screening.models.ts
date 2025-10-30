import { ScreeningEntity, screeningsMock } from "./entities/screenings.entity";

export class ScreeningMock {
    private data: ScreeningEntity[];

    constructor(initial = screeningsMock) {
        // clonar para no mutar el mock original
        this.data = initial.map(s => s);
    }

    getAll(): ScreeningEntity[] {
        return [...this.data];
    }

    getById(id: number): ScreeningEntity | undefined {
        return this.data.find(s => s.getIdScreening() === id);
    }

    create(payload: {
        date: Date | string;
        start: Date | string;
        end: Date | string;
        ticketPrice: number;
    }): ScreeningEntity {
        const id = this.nextId();
        const entity = new ScreeningEntity(id, payload.date, payload.start, payload.end, payload.ticketPrice);
        this.data.push(entity);
        return entity;
    }

    update(id: number, payload: Partial<{
        date: Date | string;
        start: Date | string;
        end: Date | string;
        ticketPrice: number;
    }>): ScreeningEntity | undefined {
        const idx = this.data.findIndex(s => s.getIdScreening() === id);
        if (idx === -1) return undefined;

        const current = this.data[idx];
        const date = payload.date ?? current.getDate();
        const start = payload.start ?? current.getStart();
        const end = payload.end ?? current.getEnd();
        const ticketPrice = payload.ticketPrice ?? current.getTicketPrice();

        const updated = new ScreeningEntity(id, date, start, end, ticketPrice);
        this.data[idx] = updated;
        return updated;
    }

    delete(id: number): boolean {
        const idx = this.data.findIndex(s => s.getIdScreening() === id);
        if (idx === -1) return false;
        this.data.splice(idx, 1);
        return true;
    }

    findAvailable(): ScreeningEntity[] {
        return this.data.filter(s => s.isAvailable());
    }

    private nextId(): number {
        return this.data.reduce((max, s) => Math.max(max, s.getIdScreening()), 0) + 1;
    }
}