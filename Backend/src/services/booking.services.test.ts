import bookingService from "./booking.services";
import { sequelize } from "../config/database";
import { User } from "../models/user.model";
import { Room } from "../models/room.model";
import { Seat } from "../models/seat.model";
import { Movie } from "../models/movie.model";
import { Screening } from "../models/screening.model";

describe("BookingService transactional booking", () => {
  let user: User;
  let room: Room;
  let seat: Seat;
  let movie: Movie;
  let screening: Screening;

  beforeAll(async () => {
    // force-create fresh schema so that new index/column is present
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    // clear existing data by forcing sync; maintains schema including indexes
    await sequelize.sync({ force: true });

    user = await User.create({
      name: "test",
      email: "user@example.com",
      password: "secret",
    });

    room = await Room.create({
      name: "Room1",
      capacity: 10,
      type: "Standard",
      rows: 2,
      cols: 5,
      isActive: true,
    });

    seat = await Seat.create({
      roomId: room.idRoom,
      row: 1,
      column: 1,
      type: "Standard",
    });

    movie = await Movie.create({
      name: "Some Movie",
      length: 90,
      description: "desc",
      genre: "Action",
      categorie: "A",
      director: "D",
      lenguage: "EN",
      subtitles: false,
    });

    screening = await Screening.create({
      movieId: movie.idMovie,
      roomId: room.idRoom,
      date: new Date(),
      start: new Date(),
      end: new Date(),
      ticketPrice: 5,
    });
  });

  it("should create a reservation and reject a second for same seat", async () => {
    const first = await bookingService.createReservation(
      screening.idScreening,
      user.idUser,
      [{ row: 1, column: 1 }],
    );
    expect(first).toBeDefined();

    await expect(
      bookingService.createReservation(screening.idScreening, user.idUser, [
        { row: 1, column: 1 },
      ]),
    ).rejects.toThrow(/occupied/);
  });

  it("should only allow one of two concurrent attempts", async () => {
    const p1 = bookingService.createReservation(
      screening.idScreening,
      user.idUser,
      [{ row: 1, column: 1 }],
    );
    const p2 = bookingService.createReservation(
      screening.idScreening,
      user.idUser,
      [{ row: 1, column: 1 }],
    );

    const results = await Promise.allSettled([p1, p2]);
    const successes = results.filter((r) => r.status === "fulfilled");
    const failures = results.filter((r) => r.status === "rejected");

    expect(successes.length).toBe(1);
    expect(failures.length).toBe(1);
    const reason = (failures[0] as PromiseRejectedResult).reason;
    expect(reason).toBeInstanceOf(Error);
    // some databases might return deadlock instead of custom message when
    // two requests collide; allow either text so tests are robust.
    expect(reason.message).toMatch(/occupied|Deadlock/);
  });
});
