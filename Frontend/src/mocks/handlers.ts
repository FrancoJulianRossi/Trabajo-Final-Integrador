// @ts-nocheck
import { http } from "msw";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000/api";

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

const users = [
  {
    idUser: 1,
    name: "admin",
    email: "admin@example.com",
    role: "admin",
  },
  {
    idUser: 2,
    name: "cliente",
    email: "client@example.com",
    role: "client",
  },
];

const rooms = [
  {
    idRoom: 1,
    Name: "Sala A",
    Capacity: 80,
    Location: "Piso 1",
    Layout: "8x10",
  },
  {
    idRoom: 2,
    Name: "Sala B",
    Capacity: 120,
    Location: "Piso 2",
    Layout: "10x12",
  },
  {
    idRoom: 3,
    Name: "Sala C",
    Capacity: 50,
    Location: "Piso 1",
    Layout: "5x10",
  },
];

export const handlers = [
  // Movies list
  http.get(`${API_BASE}/movies`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(movies));
  }),

  // Screenings list
  http.get(`${API_BASE}/screenings`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(screenings));
  }),

  // Seats for a screening (return some occupied seats)
  http.get(`${API_BASE}/screenings/:id/seats`, (req, res, ctx) => {
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
  }),

  // Auth: login
  http.post(`${API_BASE}/auth/login`, async (req, res, ctx) => {
    const body = await req.json();
    const { email } = body;
    // Accept any email/password in mock
    const user = { idUser: 1, name: "Usuario Mock", email, role: "client" };
    return res(ctx.status(200), ctx.json({ token: "mock-token-123", user }));
  }),

  // Auth: register
  http.post(`${API_BASE}/auth/register`, async (req, res, ctx) => {
    const body = await req.json();
    const user = {
      idUser: Date.now(),
      name: body.name || "Nuevo",
      email: body.email,
      role: "client",
    };
    return res(ctx.status(201), ctx.json({ token: "mock-token-123", user }));
  }),

  // Auth: forgot-password
  http.post(`${API_BASE}/auth/forgot-password`, async (req, res, ctx) => {
    const body = await req.json();
    // simply echo back message
    return res(
      ctx.status(200),
      ctx.json({ message: "mocked", token: "fake-token" }),
    );
  }),

  // Auth: reset-password
  http.post(`${API_BASE}/auth/reset-password`, async (req, res, ctx) => {
    const body = await req.json();
    if (!body.token || !body.newPassword) {
      return res(ctx.status(400), ctx.json({ message: "Missing fields" }));
    }
    return res(ctx.status(200), ctx.json({ message: "Password reset" }));
  }),

  // Profile endpoints
  http.get(`${API_BASE}/users/me`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        idUser: 1,
        name: "Mock User",
        email: "mock@example.com",
        role: "client",
      }),
    );
  }),
  http.put(`${API_BASE}/users/me`, async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(200),
      ctx.json({ ...body, idUser: 1, role: "client" }),
    );
  }),

  // Bookings list (GET)
  http.get(`${API_BASE}/bookings`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(bookings));
  }),

  // Users list (GET)
  http.get(`${API_BASE}/users`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(users));
  }),

  // Rooms list (GET)
  http.get(`${API_BASE}/rooms`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(rooms));
  }),

  // Create booking (POST)
  http.post(`${API_BASE}/bookings`, async (req, res, ctx) => {
    const body = await req.json();
    // Basic conflict detection: if any seat already booked, return 409
    const requested = body.seats || [];
    const conflict = bookings.some(
      (b) =>
        b.screening.idScreening === body.screening.idScreening &&
        b.seats.some((s: any) =>
          requested.some((r: any) => r.row === s.row && r.column === s.column),
        ),
    );
    if (conflict) {
      return res(ctx.status(409), ctx.json({ message: "Asiento ya ocupado" }));
    }
    const reservation: any = {
      idReservation: Date.now(),
      reservationDate: new Date().toISOString(),
      status: "confirmed",
      total: (requested.length || 0) * (body.screening.ticketPrice || 0),
      seats: requested,
      screening: body.screening,
    };
    if (body.userId) {
      reservation.userId = body.userId;
    }
    bookings.push(reservation);
    return res(ctx.status(201), ctx.json(reservation));
  }),
];
