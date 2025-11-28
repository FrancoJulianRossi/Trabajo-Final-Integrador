import { seat } from "./entities/seat.entity";

export let seats: seat[] = [
  new seat(1, 1, 1),
  new seat(2, 1, 2),
  new seat(3, 1, 3),
  new seat(4, 1, 4),
  new seat(5, 1, 5),
  new seat(6, 2, 1),
  new seat(7, 2, 2),
  new seat(8, 2, 3),
  new seat(9, 2, 4),
  new seat(10, 2, 5),
];

export function seedSeats(initial: seat[]) {
  seats = initial.map(
    (s, idx) => new seat(s["id"] ?? idx + 1, s["row"] ?? 1, s["column"] ?? 1)
  );
}
