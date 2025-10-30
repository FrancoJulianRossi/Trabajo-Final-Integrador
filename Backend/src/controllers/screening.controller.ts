import { ScreeningEntity } from '../models/mocks/entities/screening.entity';
import { screeningMock } from '../models/mocks/screening.models';

export class ScreeningController {
    getAllScreenings(): ScreeningEntity[] {
        return [screeningMock];
    }

    getScreeningById(id: number): ScreeningEntity | null {
        const screening = screeningMock;
        return screening.getIdScreening() === id ? screening : null;
    }

    createScreening(screeningData: {
        date: Date | string;
        start: Date | string;
        end: Date | string;
        ticketPrice: number;
    }): ScreeningEntity {
        return new ScreeningEntity(
            1, // You may want to generate this dynamically
            new Date(screeningData.date),
            new Date(screeningData.start),
            new Date(screeningData.end),
            screeningData.ticketPrice
        );
    }

    updateScreening(id: number, screeningData: {
        date: Date | string;
        start: Date | string;
        end: Date | string;
        ticketPrice: number;
    }): ScreeningEntity | null {
        const screening = this.getScreeningById(id);
        if (!screening) return null;

        return new ScreeningEntity(
            id,
            new Date(screeningData.date),
            new Date(screeningData.start),
            new Date(screeningData.end),
            screeningData.ticketPrice
        );
    }

    deleteScreening(id: number): boolean {
        return this.getScreeningById(id) !== null;
    }
}
