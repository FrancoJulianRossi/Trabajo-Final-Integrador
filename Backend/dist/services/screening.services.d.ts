import { Screening } from "../models/screening.model";
export declare class ScreeningHasReservationsError extends Error {
    constructor(message: string);
}
export declare class ScreeningValidationError extends Error {
    constructor(message: string);
}
export declare class ScreeningService {
    getScreeningById(id: number): Promise<Screening | null>;
    getScreenings(movieId?: number): Promise<Screening[]>;
    /**
     * Calculates the end time of a screening based on movie length and start time.
     * Mutates the provided `data` object to include `end` if possible.
     */
    /**
     * Combines a date string (YYYY-MM-DD) with a time string (HH:mm or full iso)
     * into a single Date object. If the `time` already contains a full date-time,
     * it is returned as-is. Returns `null` when the inputs are not parseable.
     */
    private combineDateTime;
    private computeEndTime;
    private validateTiming;
    createScreening(data: Partial<Screening>): Promise<Screening>;
    updateScreening(id: number, data: Partial<Screening>): Promise<Screening | null>;
    deleteScreening(id: number): Promise<boolean>;
    getOccupiedSeats(screeningId: number): Promise<{
        row: number;
        column: number;
    }[]>;
}
//# sourceMappingURL=screening.services.d.ts.map