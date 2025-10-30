import { ScreeningEntity } from "./entities/screenings.entity";

export const screeningMock = new ScreeningEntity(
    1,
    new Date('2023-12-01'),
    new Date('2023-12-01T18:00:00'),
    new Date('2023-12-01T20:00:00'),
    350.0
);

export const screeningMockUpdated = new ScreeningEntity(
    1,
    new Date('2023-12-02'),
    new Date('2023-12-02T18:00:00'),
    new Date('2023-12-02T20:00:00'),
    350.0
);