import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const ResetPasswordPage: React.FC = () => {
    const { resetPassword } = useAuth();
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const query = useQuery();
    const token = query.get("token") || "";

    useEffect(() => {
        if (!token) {
            setError("Token de restablecimiento inválido");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        if (newPassword !== confirm) {
            setError("Las contraseñas no coinciden");
            return;
        }
        setLoading(true);
        try {
            await resetPassword(token, newPassword);
            setMessage("Contraseña actualizada, ya puede iniciar sesión.");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            setError(err.message || "Error al restablecer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={5}>
                    <h2 className="mb-4 text-center">Restablecer Contraseña</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    {!message && (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nueva contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Confirmar contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button
                                type="submit"
                                className="w-100"
                                disabled={loading || !!error}
                            >
                                {loading ? "Actualizando..." : "Cambiar contraseña"}
                            </Button>
                        </Form>
                    )}
                    <div className="mt-3 text-center">
                        <Link to="/login">Volver al inicio de sesión</Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};