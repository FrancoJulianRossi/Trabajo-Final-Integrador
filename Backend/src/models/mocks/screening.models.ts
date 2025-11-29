import { ScreeningEntity } from "./entities/screening.entity";

export const screeningMock = new ScreeningEntity(
  1,
  new Date("2023-12-01"),
  new Date("2023-12-01T18:00:00"),
  new Date("2023-12-01T20:00:00"),
  350.0
);

export const screeningMockUpdated = new ScreeningEntity(
  2,
  new Date("2023-12-02"),
  new Date("2023-12-02T18:00:00"),
  new Date("2023-12-02T20:00:00"),
  350.0
);

export let screenings: ScreeningEntity[] = [
  screeningMock,
  screeningMockUpdated,
];

export function seedScreenings(initial: ScreeningEntity[]) {
  screenings = initial.map(
    (s, idx) =>
      new ScreeningEntity(
        s.getIdScreening ? s.getIdScreening() : s["idScreening"] || idx + 1,
        s.getDate(),
        s.getStart(),
        s.getEnd(),
        s.getTicketPrice()
      )
  );
}