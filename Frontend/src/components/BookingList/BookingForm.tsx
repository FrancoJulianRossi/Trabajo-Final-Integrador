import React, { useEffect, useMemo, useState } from "react";
import { Form, Button, Alert, Badge, Spinner } from "react-bootstrap";
import { getRoomSeats, getSeats } from "../../api/mockClient";

import type { Reservation, Screening, User } from "./types";

const SEAT_COLORS: Record<string, string> = {
  Standard: "#6c757d",
  VIP: "#ffc107",
  Disabled: "#0dcaf0",
  Empty: "transparent",
  Selected: "#28a745",
  Occupied: "#343a40",
};

type SeatCell = {
  idSeat: number;
  row: number;
  column: number;
  roomId: number;
  type?: string;
};

const seatKey = (row: number, column: number) => `${row}-${column}`;
const seatLabel = (row: number, column: number) =>
  `${String.fromCharCode(64 + row)}${column}`;

export const parseSeatToken = (
  raw: string,
): { row: number; column: number } | null => {
  const token = raw.trim().toUpperCase();
  if (!token) return null;

  const letterMatch = token.match(/^([A-Z])[-\s]?(\d+)$/);
  if (letterMatch) {
    const row = letterMatch[1].charCodeAt(0) - 64;
    const column = Number(letterMatch[2]);
    if (row > 0 && column > 0) return { row, column };
  }

  const numericMatch = token.match(/^(\d+)\s*[-:]\s*(\d+)$/);
  if (numericMatch) {
    const row = Number(numericMatch[1]);
    const column = Number(numericMatch[2]);
    if (row > 0 && column > 0) return { row, column };
  }

  return null;
};

export const parseSeatsInput = (seatsInput: string) => {
  const tokens = seatsInput
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const parsed = tokens.map((t) => ({ token: t, seat: parseSeatToken(t) }));
  const invalid = parsed.filter((p) => !p.seat).map((p) => p.token);
  const unique = new Map<string, { row: number; column: number }>();
  parsed.forEach((p) => {
    if (!p.seat) return;
    unique.set(seatKey(p.seat.row, p.seat.column), p.seat);
  });

  return { invalid, seats: Array.from(unique.values()) };
};

const BookingForm: React.FC<{
  reservation: Reservation;
  users: User[];
  screenings: Screening[];
  isCreating: boolean;
  saving?: boolean;
  onSave: (r: Reservation) => void;
  onCancel: () => void;
}> = ({
  reservation,
  users,
  screenings,
  isCreating,
  saving,
  onSave,
  onCancel,
}) => {
  const [userId, setUserId] = useState<number>(
    reservation.userId || reservation.user?.idUser || 0,
  );
  const [screeningId, setScreeningId] = useState<number>(
    reservation.screeningId || reservation.screening?.idScreening || 0,
  );
  const [allSeats, setAllSeats] = useState<SeatCell[]>([]);
  const [occupiedKeys, setOccupiedKeys] = useState<Set<string>>(new Set());
  const [selectedSeats, setSelectedSeats] = useState<SeatCell[]>(
    (reservation.reservationSeats || []).map((rs) => ({
      idSeat: rs.seat.idSeat,
      row: rs.seat.row,
      column: rs.seat.column,
      roomId: rs.seat.roomId,
      type: "Standard",
    })),
  );
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [seatsError, setSeatsError] = useState("");
  const [error, setError] = useState("");

  const selectedUser = useMemo(
    () => users.find((u) => u.idUser === userId),
    [users, userId],
  );

  const selectedScreening = useMemo(
    () =>
      screenings.find((s) => s.idScreening === screeningId) ||
      reservation.screening,
    [screenings, screeningId, reservation.screening],
  );

  const initialReservationKeys = useMemo(
    () =>
      new Set(
        (reservation.reservationSeats || []).map((rs) =>
          seatKey(rs.seat.row, rs.seat.column),
        ),
      ),
    [reservation.reservationSeats],
  );

  useEffect(() => {
    setError("");
    setSeatsError("");
    if (!selectedScreening?.idScreening || !selectedScreening?.roomId) {
      setAllSeats([]);
      setOccupiedKeys(new Set());
      return;
    }

    const fetchSeatMap = async () => {
      setLoadingSeats(true);
      try {
        const [occupiedData, roomSeats] = await Promise.all([
          getSeats(selectedScreening.idScreening),
          getRoomSeats(selectedScreening.roomId),
        ]);

        const occupied = (occupiedData?.occupied || []) as Array<{
          row: number;
          column: number;
        }>;

        const occupiedSet = new Set<string>();
        occupied.forEach((s) => occupiedSet.add(seatKey(s.row, s.column)));

        const roomSeatList = ((roomSeats || []) as any[]).map((s) => ({
          idSeat: Number(s.idSeat),
          row: Number(s.row),
          column: Number(s.column),
          roomId: Number(s.roomId || selectedScreening.roomId || 0),
          type: s.type || "Standard",
        }));

        setAllSeats(roomSeatList);
        setOccupiedKeys(occupiedSet);

        const baseKeys =
          screeningId === reservation.screeningId
            ? initialReservationKeys
            : new Set<string>();
        const nextSelected = roomSeatList.filter((s) =>
          baseKeys.has(seatKey(s.row, s.column)),
        );
        setSelectedSeats(nextSelected);
      } catch {
        setAllSeats([]);
        setOccupiedKeys(new Set());
        setSeatsError("No se pudo cargar el mapa de asientos para esta funcion.");
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchSeatMap();
  }, [selectedScreening?.idScreening, selectedScreening?.roomId]);

  useEffect(() => {
    if (screeningId !== reservation.screeningId) {
      setSelectedSeats([]);
    }
  }, [screeningId, reservation.screeningId]);

  const selectedSeatKeys = useMemo(
    () => new Set(selectedSeats.map((s) => seatKey(s.row, s.column))),
    [selectedSeats],
  );

  const maxRow = useMemo(
    () => Math.max(...allSeats.map((s) => s.row), 0),
    [allSeats],
  );
  const maxCol = useMemo(
    () => Math.max(...allSeats.map((s) => s.column), 0),
    [allSeats],
  );

  const toggleSeat = (seat: SeatCell) => {
    const key = seatKey(seat.row, seat.column);
    const isOccupied = occupiedKeys.has(key) && !selectedSeatKeys.has(key);
    if ((seat.type || "Standard") === "Empty" || isOccupied) {
      return;
    }

    if (selectedSeatKeys.has(key)) {
      setSelectedSeats((prev) =>
        prev.filter((s) => seatKey(s.row, s.column) !== key),
      );
      return;
    }

    setSelectedSeats((prev) => [...prev, seat]);
  };

  const ticketPrice = selectedScreening?.ticketPrice || 0;
  const newTotal = selectedSeats.length * ticketPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("Selecciona un usuario.");
      return;
    }
    if (!screeningId) {
      setError("Selecciona una funcion.");
      return;
    }
    if (selectedSeats.length === 0) {
      setError("Debes seleccionar al menos un asiento.");
      return;
    }

    const nowIso = new Date().toISOString();
    const updated: Reservation = {
      ...reservation,
      reservationDate: reservation.reservationDate || nowIso,
      userId,
      user: selectedUser,
      screeningId,
      screening: {
        ...(selectedScreening || ({} as Screening)),
        idScreening: screeningId,
      } as Screening,
      reservationSeats: selectedSeats.map((s, idx) => ({
        reservationId: reservation.idReservation,
        seatId: s.idSeat || idx + 1,
        seat: {
          idSeat: s.idSeat || idx + 1,
          row: s.row,
          column: s.column,
          roomId: s.roomId,
        },
      })),
      status: reservation.status || "Confirmed",
      total: newTotal,
    };

    onSave(updated);
  };

  const renderGrid = () => {
    if (allSeats.length === 0) return null;

    const rows: React.ReactNode[] = [];
    for (let r = 1; r <= maxRow; r++) {
      const cells: React.ReactNode[] = [];
      for (let c = 1; c <= maxCol; c++) {
        const seat = allSeats.find((s) => s.row === r && s.column === c);
        if (!seat) {
          cells.push(
            <div
              key={`blank-${r}-${c}`}
              style={{ width: 34, height: 34, margin: 3 }}
            />,
          );
          continue;
        }

        const key = seatKey(seat.row, seat.column);
        const selected = selectedSeatKeys.has(key);
        const occupied = occupiedKeys.has(key) && !selected;
        const type = seat.type || "Standard";
        const color = selected
          ? SEAT_COLORS.Selected
          : occupied
            ? SEAT_COLORS.Occupied
            : SEAT_COLORS[type] || SEAT_COLORS.Standard;

        const actionable = type !== "Empty" && !occupied;

        cells.push(
          <button
            type="button"
            key={seat.idSeat}
            onClick={() => toggleSeat(seat)}
            disabled={!actionable || !!saving}
            title={seatLabel(seat.row, seat.column)}
            style={{
              width: 34,
              height: 34,
              margin: 3,
              borderRadius: 6,
              border: type === "Empty" ? "none" : "1px solid #555",
              backgroundColor: color,
              cursor: actionable ? "pointer" : "not-allowed",
              color: "white",
              fontSize: 10,
              opacity: occupied ? 0.65 : 1,
            }}
          >
            {type === "Empty" ? "" : seatLabel(seat.row, seat.column)}
          </button>,
        );
      }
      rows.push(
        <div key={`row-${r}`} className="d-flex justify-content-center">
          {cells}
        </div>,
      );
    }

    return rows;
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {seatsError && <Alert variant="warning">{seatsError}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Usuario</Form.Label>
        <Form.Select
          value={userId || ""}
          onChange={(e) => setUserId(Number(e.target.value || 0))}
          required
          disabled={!!saving}
        >
          <option value="">-- seleccionar usuario --</option>
          {users.map((u) => (
            <option key={u.idUser} value={u.idUser}>
              #{u.idUser} - {u.name} ({u.email})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Funcion</Form.Label>
        <Form.Select
          value={screeningId || ""}
          onChange={(e) => setScreeningId(Number(e.target.value || 0))}
          required
          disabled={!!saving}
        >
          <option value="">-- seleccionar funcion --</option>
          {screenings.map((s) => (
            <option key={s.idScreening} value={s.idScreening}>
              #{s.idScreening} - {s.movie?.name || "Pelicula"} - {s.date}{" "}
              {s.start ? `(${s.start})` : ""}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <div className="mb-3 p-3 border rounded bg-light">
        <div className="mb-2 text-center fw-semibold">Seleccion de asientos</div>
        {loadingSeats && (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" className="me-2" />
            Cargando asientos...
          </div>
        )}
        {!loadingSeats && allSeats.length === 0 && (
          <div className="text-center text-muted py-2">
            Selecciona una funcion para ver su mapa de asientos.
          </div>
        )}
        {!loadingSeats && allSeats.length > 0 && (
          <>
            <div className="mb-3 w-75 mx-auto text-center p-1 bg-dark text-white rounded">
              PANTALLA
            </div>
            {renderGrid()}
            <div className="d-flex justify-content-center flex-wrap gap-3 mt-3">
              {[
                ["Standard", "Disponible"],
                ["Occupied", "Ocupado"],
                ["Selected", "Seleccionado"],
              ].map(([k, label]) => (
                <div key={k} className="d-flex align-items-center gap-1">
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      display: "inline-block",
                      backgroundColor: SEAT_COLORS[k],
                      borderRadius: 3,
                      border: "1px solid #555",
                    }}
                  />
                  <small>{label}</small>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mb-2">
        <strong>Asientos seleccionados:</strong>{" "}
        {selectedSeats.length === 0 ? (
          <span className="text-muted">ninguno</span>
        ) : (
          selectedSeats
            .sort((a, b) => a.row - b.row || a.column - b.column)
            .map((s) => (
              <Badge key={seatKey(s.row, s.column)} bg="primary" className="me-1">
                {seatLabel(s.row, s.column)}
              </Badge>
            ))
        )}
      </div>

      <div className="mb-3 mt-2">
        <strong>Total estimado:</strong> ${newTotal}
      </div>

      <div className="text-end">
        <Button
          variant="secondary"
          onClick={onCancel}
          className="me-2"
          disabled={!!saving}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={!!saving || loadingSeats}>
          {saving ? "Guardando..." : isCreating ? "Crear reserva" : "Guardar cambios"}
        </Button>
      </div>
    </Form>
  );
};

export default BookingForm;
