import React from "react";
import { Button } from "react-bootstrap";

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

const BookingView: React.FC<{
  reservation: Reservation;
  onClose: () => void;
}> = ({ reservation, onClose }) => {
  return (
    <div>
      <h5>Reserva #{reservation.id}</h5>
      <p>
        <strong>Cliente:</strong> {reservation.customerName}
      </p>
      <p>
        <strong>Fecha:</strong> {reservation.screening?.date}
      </p>
      <p>
        <strong>Inicio:</strong> {reservation.screening?.start}
      </p>
      <p>
        <strong>Asientos:</strong>{" "}
        {reservation.seats.map((s) => `${s.row}-${s.column}`).join(", ")}
      </p>
      <p>
        <small>Creada: {reservation.createdAt}</small>
      </p>
      <div className="text-end">
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  );
};

export default BookingView;
