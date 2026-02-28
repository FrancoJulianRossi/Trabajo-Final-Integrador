import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

interface Seat {
  id: number;
  row: number;
  column: number;
}

interface Screening {
  idScreening: number;
  date: string;
  start: string;
  end: string;
  ticketPrice: number;
}

interface Reservation {
  id: number;
  screening: Screening;
  seats: Seat[];
  customerName?: string;
  createdAt?: string;
}

const BookingForm: React.FC<{
  reservation: Reservation;
  onSave: (r: Reservation) => void;
  onCancel: () => void;
}> = ({ reservation, onSave, onCancel }) => {
  const [customerName, setCustomerName] = useState(
    reservation.customerName || ""
  );
  const [date, setDate] = useState(
    reservation.screening?.date || new Date().toISOString().split("T")[0]
  );
  const [start, setStart] = useState(reservation.screening?.start || "");
  const [seatsText, setSeatsText] = useState(
    (reservation.seats || []).map((s) => `${s.row}-${s.column}`).join(",")
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const seats = seatsText.split(",").map((s, idx) => {
      const [row, col] = s.split("-").map(Number);
      return { id: idx + 1, row: row || 1, column: col || 1 } as Seat;
    });
    const updated: Reservation = {
      ...reservation,
      customerName,
      screening: { ...(reservation.screening || {}), date, start },
      seats,
      createdAt: reservation.createdAt || new Date().toISOString(),
    };
    onSave(updated);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-2">
        <Form.Label>Nombre cliente</Form.Label>
        <Form.Control
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
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
        <Form.Label>Asientos (ej: 1-1,1-2)</Form.Label>
        <Form.Control
          value={seatsText}
          onChange={(e) => setSeatsText(e.target.value)}
        />
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
