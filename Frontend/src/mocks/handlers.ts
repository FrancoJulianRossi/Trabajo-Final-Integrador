// @ts-nocheck
import { http } from "msw";

// Simple mock data used by the handlers
const movies = [
  {
    IdMovie: 1,
    Name: "La Gran Aventura",
    Description: "Una película de aventura épica.",
    Length: 120,
    Genre: "Aventura",
    Director: "Juan Pérez",
    Poster: "",
  },
  {
    IdMovie: 2,
    Name: "Comedia en Casa",
    Description: "Risas garantizadas.",
    Length: 95,
    Genre: "Comedia",
    Director: "Ana Gómez",
    Poster: "",
  },
];

const screenings = [
  {
    idScreening: 1,
    movieId: 1,
    date: "2025-12-01",
    start: new Date().toISOString(),
    end: new Date(Date.now() + 1000 * 60 * 120).toISOString(),
    ticketPrice: 350,
  },
  {
    idScreening: 2,
    movieId: 2,
    date: "2025-12-02",
    start: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
    end: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    ticketPrice: 300,
  },
];

let bookings: any[] = [];

export const handlers = [
  // Movies list
  http.get("http://127.0.0.1:3000/api/movies", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(movies));
  }),

  // Screenings list
  http.get("http://127.0.0.1:3000/api/screenings", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(screenings));
  }),

  // Seats for a screening (return some occupied seats)
  http.get(
    "http://127.0.0.1:3000/api/screenings/:id/seats",
    (req, res, ctx) => {
      const { id } = req.params as any;
      // Simple static occupied seats per screening id
      const occupied =
        id === "1"
          ? [
              { row: 1, column: 2 },
              { row: 2, column: 3 },
            ]
          : [{ row: 3, column: 4 }];
      return res(ctx.status(200), ctx.json({ occupied }));
    }
  ),

  // Auth: login
  http.post("http://127.0.0.1:3000/api/auth/login", async (req, res, ctx) => {
    const body = await req.json();
    const { email } = body;
    // Accept any email/password in mock
    const user = { idUser: 1, name: "Usuario Mock", email, role: "client" };
    return res(ctx.status(200), ctx.json({ token: "mock-token-123", user }));
  }),

  // Auth: register
  http.post(
    "http://127.0.0.1:3000/api/auth/register",
    async (req, res, ctx) => {
      const body = await req.json();
      const user = {
        idUser: Date.now(),
        name: body.name || "Nuevo",
        email: body.email,
        role: "client",
      };
      return res(ctx.status(201), ctx.json({ token: "mock-token-123", user }));
    }
  ),

  // Bookings list (GET)
  http.get("http://127.0.0.1:3000/api/bookings", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(bookings));
  }),

  // Create booking (POST)
  http.post("http://127.0.0.1:3000/api/bookings", async (req, res, ctx) => {
    const body = await req.json();
    // Basic conflict detection: if any seat already booked, return 409
    const requested = body.seats || [];
    const conflict = bookings.some(
      (b) =>
        b.screening.idScreening === body.screening.idScreening &&
        b.seats.some((s: any) =>
          requested.some((r: any) => r.row === s.row && r.column === s.column)
        )
    );
    if (conflict) {
      return res(ctx.status(409), ctx.json({ message: "Asiento ya ocupado" }));
    }
    const reservation = {
      idReservation: Date.now(),
      reservationDate: new Date().toISOString(),
      status: "confirmed",
      total: (requested.length || 0) * (body.screening.ticketPrice || 0),
      seat: requested,
      screening: body.screening,
    };
    bookings.push(reservation);
    return res(ctx.status(201), ctx.json(reservation));
  }),
];
