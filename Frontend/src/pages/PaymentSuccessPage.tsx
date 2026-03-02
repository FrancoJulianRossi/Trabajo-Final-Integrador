import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Assuming React Router v6+

export const PaymentSuccessPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Automatically redirect to historial after 5 seconds
        const timer = setTimeout(() => {
            navigate('/historial');
        }, 5000);

        // Cleanup timer on component unmount
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="text-center shadow-lg border-success">
                        <Card.Body>
                            <h1 className="text-success mb-3">✅ ¡Pago Exitoso!</h1>
                            <p className="lead">
                                Tu pago se ha completado con éxito. Serás redirigido a tu historial de reservas en unos segundos.
                            </p>
                            <p>Si no eres redirigido, haz clic en el siguiente botón:</p>
                            <Button variant="success" onClick={() => navigate('/historial')}>
                                Ir a mi Historial
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};