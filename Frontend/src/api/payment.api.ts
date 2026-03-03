const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000/api";
interface CreatePreferencePayload {
  userId: number;
  screeningId: number;
  seatIds: number[];
}

interface CreatePreferenceResponse {
  success: boolean;
  message: string;
  data: {
    idReservation: number;
    preferenceId: string;
    initPoint: string;
    sandboxInitPoint: string;
  };
}

async function fetchJson(
  url: string,
  opts?: RequestInit,
): Promise<CreatePreferenceResponse | null> {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function createMercadoPagoPreference(
  payload: CreatePreferencePayload,
  token?: string,
): Promise<string> {
  const response = await fetchJson(`${API_BASE}/payments/create-preference`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response?.data?.initPoint) {
    throw new Error("Failed to get Mercado Pago init point.");
  }

  // TODO: Consider using sandboxInitPoint based on environment
  return response.data.initPoint;
}
