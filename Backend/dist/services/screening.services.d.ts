import { ScreeningEntity } from "../models/mocks/entities/screening.entity";
export declare class ScreeningService {
    private screenings;
    constructor();
    getScreeningById(id: number): ScreeningEntity | null;
    getScreenings(): ScreeningEntity[];
    createScreening(screening: ScreeningEntity): ScreeningEntity;
    updateScreening(id: number, screening: ScreeningEntity): ScreeningEntity | null;
    deleteScreening(id: number): boolean;
    getOccupiedSeats(screeningId: number): {
        row: number;
        column: number;
    }[];
}
//# sourceMappingURL=screening.services.d.ts.map