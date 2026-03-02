import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

import type { Reservation } from "./types";

const BookingForm: React.FC<{
  reservation: Reservation;
  onSave: (r: Reservation) => void;
  onCancel: () => void;
}> = ({ reservation, onSave, onCancel }) => {
  const [userName, setUserName] = useState(reservation.user?.name || "");
  const [date, setDate] = useState(
    reservation.screening?.date || new Date().toISOString().split("T")[0],
  );
  const [start, setStart] = useState(reservation.screening?.start || "");
  const [seatsInput, setSeatsInput] = useState(
    (reservation.reservationSeats || [])
      .map((rs) => `${rs.seat.row}-${rs.seat.column}`)
      .join(", "),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentSeats = reservation.reservationSeats || [];
    // Parse input to find valid seats
    // Split by comma, space, or other separators
    const tokens = seatsInput.split(/[ ,]+/).filter((t) => t.trim() !== "");

    // Keep only seats that match the tokens in the input
    const updatedSeats = currentSeats.filter((rs) => {
      const label = `${rs.seat.row}-${rs.seat.column}`;
      return tokens.includes(label);
    });

    const ticketPrice = reservation.screening?.ticketPrice || 0;
    const newTotal = updatedSeats.length * ticketPrice;

    // Nota: En la realidad, el backend maneja la creación de asientos
    // Solo actualizamos los datos de la reserva
    const updated: Reservation = {
      ...reservation,
      reservationDate: reservation.reservationDate || new Date().toISOString(),
      screeningId: reservation.screeningId,
      userId: reservation.userId,
      screening: {
        ...(reservation.screening || ({} as any)),
        date,
        start,
      } as any,
      reservationSeats: updatedSeats,
      total: newTotal,
    };
    onSave(updated);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-2">
        <Form.Label>Nombre usuario</Form.Label>
        <Form.Control
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          disabled
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Inicio</Form.Label>
            <Form.Control
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="HH:MM"
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-2">
        <Form.Label>Asientos</Form.Label>
        <Form.Control
          value={seatsInput}
          onChange={(e) => setSeatsInput(e.target.value)}
          placeholder="Ej: 1-2, 1-3 (Elimine para liberar)"
        />
        <Form.Text className="text-muted">
          Edite el texto para eliminar asientos. Separe con comas o espacios.
        </Form.Text>
      </Form.Group>

      <div className="text-end">
        <Button variant="secondary" onClick={onCancel} className="me-2">
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </Form>
  );
};

export default BookingForm;
