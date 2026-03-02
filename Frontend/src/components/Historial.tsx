import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  ListGroup,
  Badge,
} from "react-bootstrap";

export const Historial: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  //const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000/api"; 

  useEffect(() => {
    const fetch_bookings = async () => {
      try {
        if (!token) {
          setBookings([]);
          return;
        }
        const { getBookings } = await import("../api/mockClient");
        const data = await getBookings(token);
        // Filter by current user ID (in case of static mocks)
        const filteredData =
          user && user.idUser
            ? (data || []).filter((b: any) => b.userId === user.idUser)
            : data || [];
        setBookings(filteredData);
      } finally {
        setLoading(false);
      }
    };
    fetch_bookings();
  }, [token, user]);

  if (loading)
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" className="me-2" />
        <span>Cargando reservas...</span>
      </Container>
    );

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold text-primary">📋 Mis Reservas</h2>
      {bookings.length === 0 ? (
        <Alert variant="info" className="text-center">
          <strong>No tienes reservas aún.</strong> ¡Compra una entrada ahora!
        </Alert>
      ) : (
        <Row>
          {bookings.map((b) => (
            <Col md={6} lg={4} key={b.idReservation} className="mb-4">
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <Card.Title className="fw-bold text-primary">
                    Reserva #{b.idReservation}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    🎬 {b.screening?.movie?.name}
                  </Card.Subtitle>
                  <ListGroup variant="flush" className="mt-3">
                    <ListGroup.Item>
                      <strong>📅 Función:</strong>
                      <br />
                      <small>
                        {new Date(b.screening?.date).toLocaleDateString()}{" "}
                        {new Date(b.screening?.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(b.screening?.end).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>📍 Sala:</strong> {b.screening?.room?.name} (
                      {b.screening?.room?.type})
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>🎟️ Asientos:</strong>
                      <br />
                      <small>
                        {b.reservationSeats
                          ?.map(
                            (rs: any) =>
                              `${String.fromCharCode(64 + rs.seat.row)}${rs.seat.column}`,
                          )
                          .join(" | ")}
                      </small>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>🛒 Total de Compra:</strong>{" "}
                      <span className="text-success fw-bold">${b.total}</span>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>🗓️ Fecha y Hora de Compra:</strong>
                      <br />
                      <small>
                        {new Date(b.reservationDate).toLocaleString()}
                      </small>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>📊 Estado de la Reserva:</strong>
                      <br />
                      <Badge
                        bg={b.status === "confirmed" ? "success" : "warning"}
                        className="mt-2"
                      >
                        {b.status === "confirmed" ? "✓ Confirmada" : b.status}
                      </Badge>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};
