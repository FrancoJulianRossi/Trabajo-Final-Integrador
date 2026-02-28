import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const PaymentFailurePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="text-center shadow-lg border-danger">
                        <Card.Body>
                            <h1 className="text-danger mb-3">❌ ¡Pago Fallido!</h1>
                            <p className="lead">
                                Hubo un problema al procesar tu pago. Por favor, intenta de nuevo o contacta soporte si el problema persiste.
                            </p>
                            <Button variant="danger" onClick={() => navigate('/proceso-compra')}> {/* Assuming /proceso-compra is where user can retry */}
                                Intentar de nuevo
                            </Button>
                            <Button variant="link" onClick={() => navigate('/historial')}>
                                Ir a mi Historial
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};