const USE_STATIC = Boolean(import.meta.env.VITE_STATIC_MOCKS);
const API_BASE = "http://127.0.0.1:3000/api";

async function fetchJson(url: string, opts?: RequestInit) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getMovies() {
  if (USE_STATIC) return fetchJson("/mocks/movies.json");
  return fetchJson(`${API_BASE}/movies`);
}

export async function getScreenings() {
  if (USE_STATIC) return fetchJson("/mocks/screenings.json");
  return fetchJson(`${API_BASE}/screenings`);
}

export async function getSeats(screeningId: number) {
  if (USE_STATIC) return fetchJson(`/mocks/seats-${screeningId}.json`);
  return fetchJson(`${API_BASE}/screenings/${screeningId}/seats`);
}

export async function login(email: string, password: string) {
  if (USE_STATIC) {
    // Accept two test users in users.json
    const users = await fetchJson("/mocks/users.json");
    const u = users.find((x: any) => x.email === email) || users[1];
    return { token: "static-token", user: u };
  }
  return fetchJson(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string) {
  if (USE_STATIC) {
    const user = { idUser: Date.now(), name, email, role: "client" };
    return { token: "static-token", user };
  }
  return fetchJson(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getBookings(token?: string) {
  if (USE_STATIC) return fetchJson("/mocks/bookings.json");
  return fetchJson(`${API_BASE}/bookings`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function createBooking(payload: any, token?: string) {
  if (USE_STATIC) {
    // Append locally to public/mock bookings is not possible from client; return fake reservation
    return {
      idReservation: Date.now(),
      reservationDate: new Date().toISOString(),
      status: "confirmed",
      total: (payload.seats?.length || 0) * payload.screening.ticketPrice,
      seat: payload.seats,
      screening: payload.screening,
    };
  }
  return fetchJson(`${API_BASE}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
}
