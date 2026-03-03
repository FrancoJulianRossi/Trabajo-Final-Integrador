import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { createMercadoPagoPreference } from "../api/payment.api";

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

export const ProcesoCompra: React.FC<{
  screening: Screening;
  movie: Movie;
  seats: Seat[];
  onConfirm: () => void;
  onBack: () => void;
}> = ({ screening, movie, seats, onConfirm, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, token } = useAuth();
  const total = seats.length * screening.ticketPrice;

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      if (!user?.idUser) {
        throw new Error("User not authenticated.");
      }

      const payload = {
        userId: user.idUser,
        screeningId: screening.idScreening,
        seatIds: seats.map((s) => (s as any).idSeat),
      };

      const initPoint = await createMercadoPagoPreference(
        payload,
        token || undefined,
      );

      // Redirigir al usuario al initPoint de Mercado Pago
      window.location.href = initPoint;
    } catch (err: any) {
      console.error("Error al crear preferencia de Mercado Pago:", err);
      setError(err.message || "Error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="mb-4 fw-bold text-primary text-center">
            ✓ Confirmar Reserva
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Card className="shadow-lg border-0 mb-4">
            <Card.Body>
              <Card.Title className="fw-bold text-primary">
                {movie.Name}
              </Card.Title>
              <ListGroup variant="flush" className="mt-3">
                <ListGroup.Item>
                  <strong>🕐 Horario:</strong>{" "}
                  {new Date(screening.start).toLocaleString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>🎟️ Asientos:</strong>{" "}
                  {seats
                    .map((s) => `Fila ${s.row}, Asiento ${s.column}`)
                    .join("; ")}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>💰 Precio por asiento:</strong> $
                  {screening.ticketPrice}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>📊 Cantidad:</strong> {seats.length} asiento(s)
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <div className="bg-primary text-white p-4 rounded mb-4 text-center">
            <h3 className="fw-bold">Total: ${total}</h3>
          </div>

          <div className="d-grid gap-2">
            <Button
              variant="secondary"
              onClick={onBack}
              disabled={loading}
              className="py-2 fw-bold"
            >
              ← Volver
            </Button>
            <Button
              variant="success"
              onClick={handleConfirm}
              disabled={loading}
              className="py-2 fw-bold"
            >
              {loading ? "⏳ Procesando..." : "✓ Confirmar y Pagar"}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
