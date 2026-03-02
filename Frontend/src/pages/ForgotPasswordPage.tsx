import React, { useState } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export const ForgotPasswordPage: React.FC = () => {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);
        try {
            await forgotPassword(email);
            setMessage(
                "Si el correo existe, se ha enviado un enlace de recuperación.",
            );
            // optionally navigate or show token
        } catch (err: any) {
            setError(err.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={5}>
                    <h2 className="mb-4 text-center">Recuperar Contraseña</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" className="w-100" disabled={loading}>
                            {loading ? "Enviando..." : "Enviar enlace"}
                        </Button>
                    </Form>
                    <div className="mt-3 text-center">
                        <Link to="/login">Volver al inicio de sesión</Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};