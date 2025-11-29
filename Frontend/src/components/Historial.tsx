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
    const { token } = useAuth();
    const API_BASE = "http://127.0.0.1:3000/api";

    useEffect(() => {
        const fetch_bookings = async () => {
            try {
                const res = await fetch(`${API_BASE}/bookings`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                if (res.ok) {
                    const data = await res.json();
                    setBookings(data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetch_bookings();
    }, []);

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
                                    <ListGroup variant="flush" className="mt-3">
                                        <ListGroup.Item>
                                            <strong>📅 Fecha:</strong>
                                            <br />
                                            <small>{new Date(b.reservationDate).toLocaleString()}</small>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>📊 Estado:</strong>
                                            <br />
                                            <Badge
                                                bg={b.status === "confirmed" ? "success" : "warning"}
                                                className="mt-2"
                                            >
                                                {b.status === "confirmed" ? "✓ Confirmada" : b.status}
                                            </Badge>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>💰 Total:</strong> <span className="text-success">${b.total}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>🎟️ Asientos:</strong>
                                            <br />
                                            <small>
                                                {b.seat
                                                    ?.map((s: any) => `Fila ${s.row}, Asiento ${s.column}`)
                                                    .join(" | ")}
                                            </small>
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