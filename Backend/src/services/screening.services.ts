/*getScreeningById
getScreenings
createScreening
updateScreening
deleteScreening */
import { screeningMock } from '../models/mocks/screening.models';
import { ScreeningEntity } from '../models/mocks/entities/screening.entity';


export class ScreeningService {
    private screeningRepository: typeof screeningMock;
    constructor() {
        this.screeningRepository = screeningMock;
    }

    public getScreeningById(id: number): ScreeningEntity | null {
        if (this.screeningRepository.getIdScreening() === id) {
            return this.screeningRepository;
        }
        return null;
    }
    public getScreenings(): ScreeningEntity[] {
        return [this.screeningRepository];
    }
    public createScreening(screening: ScreeningEntity): ScreeningEntity {
        // In a real implementation, you would save to the database
        return screening;
    }
    public updateScreening(id: number, screening: ScreeningEntity): ScreeningEntity | null {
        if (this.screeningRepository.getIdScreening() === id) {
            this.screeningRepository = screening;
            return this.screeningRepository;
        }
        return null;
    }
    public deleteScreening(id: number): boolean {
        if (this.screeningRepository.getIdScreening() === id) {
            this.screeningRepository = null;
            return true;
        }
        return false;
    }
}