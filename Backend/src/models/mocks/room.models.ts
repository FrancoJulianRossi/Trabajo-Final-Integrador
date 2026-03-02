import { Room } from "./entities/room.entity";

export let rooms: Room[] = [
  new Room(1, "Sala 1", 100, "2D"),
  new Room(2, "Sala 2", 150, "3D"),
  new Room(3, "Sala 3", 200, "IMAX"),
];

export function seedRooms(initial: Room[]) {
  rooms = initial.map(
    (r, idx) =>
      new Room(
        r.getId ? r.getId() : r["id"] || idx + 1,
        r.getName ? r.getName() : r["name"] || `Sala ${idx + 1}`,
        r.getCapacity ? r.getCapacity() : r["capacity"] || 100,
        r.getType ? r.getType() : r["type"] || "2D"
      )
  );
}