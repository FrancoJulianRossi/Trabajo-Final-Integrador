import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";

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

interface Movie {
  IdMovie: number;
  Name: string;
  Length: number;
}

export const SeleccionAsientos: React.FC<{
  screening: Screening;
  movie: Movie;
  onConfirm: (seats: Seat[]) => void;
  onBack: () => void;
}> = ({ screening, movie, onConfirm, onBack }) => {
  const [occupied, setOccupied] = useState<{ row: number; column: number }[]>(
    []
  );
  const [selected, setSelected] = useState<Seat[]>([]);
  const API_BASE = "http://127.0.0.1:3000/api";

  useEffect(() => {
    const fetch_occupied = async () => {
      const res = await fetch(
        `${API_BASE}/screenings/${screening.idScreening}/seats`
      );
      if (res.ok) {
        const data = await res.json();
        setOccupied(data.occupied || []);
      }
    };
    fetch_occupied();
  }, [screening]);

  const rows = 5;
  const cols = 8;
  const seats: Seat[] = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      seats.push({ id: (r - 1) * cols + c, row: r, column: c });
    }
  }

  const is_occupied = (row: number, col: number) =>
    occupied.some((o) => o.row === row && o.column === col);
  const is_selected = (row: number, col: number) =>
    selected.some((s) => s.row === row && s.column === col);

  const toggle_seat = (seat: Seat) => {
    if (is_occupied(seat.row, seat.column)) return;
    if (is_selected(seat.row, seat.column)) {
      setSelected(selected.filter((s) => s.id !== seat.id));
    } else {
      setSelected([...selected, seat]);
    }
  };

  const total = selected.length * screening.ticketPrice;

  return (
    <Container className="py-5">
      <Button variant="outline-secondary" onClick={onBack} className="mb-4">
        ← Volver
      </Button>

      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="fw-bold text-primary mb-2">{movie.Name}</h2>
          <p className="text-muted">
            🕐 {new Date(screening.start).toLocaleTimeString()} | 💰 $
            {screening.ticketPrice} por asiento
          </p>
        </Col>
      </Row>

      <Row className="mt-4 mb-4 justify-content-center">
        <Col md={8}>
          <h3 className="fw-bold text-primary mb-3">
            🎭 Sala (Pantalla al frente)
          </h3>

          <div className="d-flex justify-content-center mb-4">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, 45px)`,
                gap: "10px",
              }}
            >
              {seats.map((s) => (
                <Button
                  key={s.id}
                  onClick={() => toggle_seat(s)}
                  variant={
                    is_occupied(s.row, s.column)
                      ? "secondary"
                      : is_selected(s.row, s.column)
                      ? "success"
                      : "light"
                  }
                  disabled={is_occupied(s.row, s.column)}
                  className="fw-bold"
                  style={{ width: "45px", height: "45px", padding: "0" }}
                >
                  {s.column}
                </Button>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-center gap-4 mb-4">
            <div>
              <Badge bg="light" text="dark" className="me-2">
                ⬜
              </Badge>
              <small>Disponible</small>
            </div>
            <div>
              <Badge bg="success" className="me-2">
                ✓
              </Badge>
              <small>Seleccionado</small>
            </div>
            <div>
              <Badge bg="secondary" className="me-2">
                ✕
              </Badge>
              <small>Ocupado</small>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mt-4 justify-content-center">
        <Col md={8}>
          <div className="bg-light p-4 rounded mb-4 border">
            <h4 className="fw-bold text-primary mb-3">
              🎟️ Asientos Seleccionados: {selected.length}
            </h4>
            {selected.length > 0 ? (
              <div>
                {selected.map((s) => (
                  <Badge key={s.id} bg="primary" className="me-2 mb-2">
                    Fila {s.row}, Asiento {s.column}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted">Selecciona asientos para continuar</p>
            )}
          </div>

          <div className="bg-primary text-white p-4 rounded mb-4">
            <h3 className="fw-bold">Total: ${total}</h3>
          </div>

          <Button
            variant="primary"
            onClick={() => onConfirm(selected)}
            disabled={selected.length === 0}
            className="w-100 py-3 fw-bold"
          >
            ✓ Confirmar Reserva
          </Button>
        </Col>
      </Row>
    </Container>
  );
};