const USE_STATIC = Boolean(import.meta.env.VITE_STATIC_MOCKS);
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000/api";

async function fetchJson(url: string, opts?: RequestInit) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }
  // Si la respuesta es 204 No Content, devolver null
  if (res.status === 204) return null;
  return res.json();
}

export async function getMovies() {
  if (USE_STATIC) return fetchJson("/mocks/movies.json");
  return fetchJson(`${API_BASE}/movies`);
}

export async function getScreenings(movieId?: number) {
  if (USE_STATIC) {
    const allScreenings = await fetchJson("/mocks/screenings.json");
    if (movieId) {
      return allScreenings.filter((s: any) => s.movieId === movieId);
    }
    return allScreenings;
  }
  const url = movieId
    ? `${API_BASE}/screenings?movieId=${movieId}`
    : `${API_BASE}/screenings`;
  return fetchJson(url);
}

export async function getSeats(screeningId: number) {
  if (USE_STATIC) return fetchJson(`/mocks/seats-${screeningId}.json`);
  return fetchJson(`${API_BASE}/screenings/${screeningId}/seats`);
}

export async function getRoomSeats(roomId: number) {
  if (USE_STATIC) return fetchJson(`/mocks/seats-${roomId}.json`);
  return fetchJson(`${API_BASE}/rooms/${roomId}/seats`);
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

// ================= Authentication extensions =================
export async function forgotPassword(email: string) {
  if (USE_STATIC) {
    console.log(`mock forgotPassword for ${email}`);
    return { message: "mocked" };
  }
  return fetchJson(`${API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string) {
  if (USE_STATIC) {
    console.log(`mock resetPassword token=${token}`);
    return { message: "mocked" };
  }
  return fetchJson(`${API_BASE}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
}

export async function getProfile(token?: string) {
  if (USE_STATIC) {
    return {
      idUser: 1,
      name: "Mock User",
      email: "mock@example.com",
      role: "client",
    };
  }
  return fetchJson(`${API_BASE}/users/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function updateProfile(payload: any, token?: string) {
  if (USE_STATIC) {
    console.log("mock updateProfile", payload);
    return { ...payload, idUser: 1, role: "client" };
  }
  return fetchJson(`${API_BASE}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
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

// =============== Carousel/Banners Functions ===============

export async function getBanners() {
  if (USE_STATIC) return fetchJson("/mocks/banners.json");
  return fetchJson(`${API_BASE}/carousel/public`);
}

export async function getCarouselItems(token?: string) {
  if (USE_STATIC) return fetchJson("/mocks/banners.json");
  return fetchJson(`${API_BASE}/admin/carousel`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function createCarouselItem(
  formData: FormData,
  token?: string,
): Promise<any> {
  if (USE_STATIC) {
    console.log("Mock createCarouselItem called with formData:", formData);
    // Return a mock carousel item
    return {
      id: Math.floor(Math.random() * 10000),
      title: formData.get("title") || "Mock Banner",
      subtitle: formData.get("subtitle") || "",
      desktopImageUrl: "https://via.placeholder.com/1920x800",
      link: formData.get("link") || "",
      order: parseInt(formData.get("order") as string) || 0,
      isActive: formData.get("isActive") === "true",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const res = await fetch(`${API_BASE}/admin/carousel`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }

  return res.json();
}

export async function updateCarouselItem(
  id: number | string,
  formData: FormData,
  token?: string,
): Promise<any> {
  if (USE_STATIC) {
    console.log(
      "Mock updateCarouselItem called with id:",
      id,
      "formData:",
      formData,
    );
    return {
      id,
      title: formData.get("title") || "Mock Banner",
      subtitle: formData.get("subtitle") || "",
      desktopImageUrl: "https://via.placeholder.com/1920x800",
      link: formData.get("link") || "",
      order: parseInt(formData.get("order") as string) || 0,
      isActive: formData.get("isActive") === "true",
      updatedAt: new Date().toISOString(),
    };
  }

  const res = await fetch(`${API_BASE}/admin/carousel/${id}`, {
    method: "PUT",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }

  return res.json();
}

export async function deleteCarouselItem(
  id: number | string,
  token?: string,
): Promise<void> {
  if (USE_STATIC) {
    console.log("Mock deleteCarouselItem called with id:", id);
    return;
  }

  const res = await fetch(`${API_BASE}/admin/carousel/${id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }
}

// Función legacy para compatibility - mapea updateBanners a createCarouselItem
export async function updateBanners(banners: any[]) {
  if (USE_STATIC) {
    console.log("Mock updateBanners called with:", banners);
    return { success: true, data: banners };
  }
  // Esta función ya no es necesaria con el nuevo sistema
  console.warn("updateBanners is deprecated. Use createCarouselItem instead.");
  return { success: true, data: banners };
}
