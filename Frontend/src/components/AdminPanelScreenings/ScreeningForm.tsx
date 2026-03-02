import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import type { Screening, Movie, Room } from "./types";

interface ScreeningFormProps {
  initialData?: Partial<Screening>;
  movies: Movie[];
  rooms: Room[]; // Add rooms prop
  onSave: (data: Partial<Screening>) => void;
  onCancel: () => void;
  saving?: boolean;
}

const ScreeningForm: React.FC<ScreeningFormProps> = ({
  initialData = {},
  movies,
  rooms, // Destructure rooms prop
  onSave,
  onCancel,
  saving,
}) => {
  const [data, setData] = useState<Partial<Screening>>(initialData);
  const [error, setError] = useState<string>("");

  // when initialData changes reset
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // whenever start time or movieId changes, recalc end automatically
  useEffect(() => {
    if (data.start && data.movieId) {
      const movie = movies.find((m) => m.idMovie === data.movieId);
      if (movie && typeof movie.length === "number") {
        const startDate = new Date(data.start as string);
        if (!isNaN(startDate.getTime())) {
          const endDate = new Date(
            startDate.getTime() + movie.length * 60 * 1000,
          );
          setData((d) => ({ ...d, end: endDate.toISOString() }));
        }
      }
    }
  }, [data.start, data.movieId, movies]);

  const handleSubmit = () => {
    setError("");
    if (data.start) {
      const startDate = new Date(data.start as string);
      if (startDate.getTime() < Date.now()) {
        setError("No se puede programar una función en el pasado");
        return;
      }
    }
    onSave(data);
  };

  return (
    <>
      <Form>
        <Form.Group className="mb-2">
          <Form.Label>Película</Form.Label>
          <Form.Select
            value={String(data.movieId ?? "")}
            onChange={(e) =>
              setData({
                ...data,
                movieId: Number(e.target.value || 0),
              })
            }
          >
            <option value="">-- seleccionar --</option>
            {movies.map((m) => (
              <option key={m.idMovie} value={m.idMovie}>
                {m.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Sala</Form.Label>
          <Form.Select
            value={String(data.roomId ?? "")}
            onChange={(e) =>
              setData({
                ...data,
                roomId: Number(e.target.value || 0),
              })
            }
          >
            <option value="">-- seleccionar --</option>
            {rooms.map((r) => (
              <option key={r.idRoom} value={r.idRoom}>
                {r.name} ({r.type} - {r.capacity} pax)
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            value={(data.date ?? "").slice(0, 10)}
            onChange={(e) => setData({ ...data, date: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Hora Inicio</Form.Label>
          <Form.Control
            type="time"
            value={
              data.start
                ? new Date(data.start).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""
            }
            onChange={(e) => {
              const datePart =
                data.date || new Date().toISOString().slice(0, 10);
              const iso = new Date(
                `${datePart}T${e.target.value}:00`,
              ).toISOString();
              setData({ ...data, start: iso });
            }}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Hora Fin</Form.Label>
          <Form.Control
            type="time"
            value={
              data.end
                ? new Date(data.end).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""
            }
            readOnly
            disabled
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            value={data.ticketPrice ?? 0}
            onChange={(e) =>
              setData({
                ...data,
                ticketPrice: Number(e.target.value),
              })
            }
          />
        </Form.Group>
      </Form>
      {error && <div className="text-danger mb-2">{error}</div>}
      <div className="text-end mt-3">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={saving}
          className="me-2"
        >
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving}>
          {data.idScreening ? "Guardar" : "Crear"}
        </Button>
      </div>
    </>
  );
};

export default ScreeningForm;