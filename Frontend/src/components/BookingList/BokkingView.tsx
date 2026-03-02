import React from "react";
import { Button } from "react-bootstrap";

import type { Reservation } from "./types";

const BookingView: React.FC<{
  reservation: Reservation;
  onClose: () => void;
}> = ({ reservation, onClose }) => {
  return (
    <div>
      <h5>Reserva #{reservation.idReservation}</h5>
      <p>
        <strong>Usuario:</strong> {reservation.user?.name || "Sin usuario"}
      </p>
      <p>
        <strong>Fecha:</strong> {reservation.screening?.date}
      </p>
      <p>
        <strong>Inicio:</strong> {reservation.screening?.start}
      </p>
      <p>
        <strong>Asientos:</strong>{" "}
        {(reservation.reservationSeats || [])
          .map((rs) => `${rs.seat.row}-${rs.seat.column}`)
          .join(", ")}
      </p>
      <p>
        <strong>Estado:</strong> {reservation.status}
      </p>
      <p>
        <strong>Total:</strong> ${reservation.total}
      </p>
      <p>
        <small>
          Creada: {new Date(reservation.reservationDate).toLocaleString()}
        </small>
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
