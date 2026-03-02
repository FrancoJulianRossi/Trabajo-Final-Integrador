import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const PaymentPendingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="text-center shadow-lg border-warning">
                        <Card.Body>
                            <h1 className="text-warning mb-3">⏳ Pago Pendiente</h1>
                            <p className="lead">
                                Tu pago está pendiente de confirmación. Por favor, verifica el estado de tu pago en Mercado Pago o contacta soporte si el problema persiste.
                            </p>
                            <p>Puedes volver a tu historial de reservas.</p>
                            <Button variant="warning" onClick={() => navigate('/historial')}>
                                Ir a mi Historial
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};