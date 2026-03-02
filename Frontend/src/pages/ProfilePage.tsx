import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

export const ProfilePage: React.FC = () => {
    const { user, updateProfile, refreshProfile } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);
        try {
            const payload: any = { name, email };
            if (newPassword) {
                payload.password = newPassword;
                payload.currentPassword = currentPassword;
            }
            await updateProfile(payload);
            setMessage("Perfil actualizado correctamente");
            await refreshProfile();
        } catch (err: any) {
            const msg = err?.message || "No se pudo actualizar el perfil.";
            if (msg.toLowerCase().includes("contrasena actual es incorrecta")) {
                setError(
                    "La contrasena actual que ingresaste es incorrecta. Verificala e intenta nuevamente.",
                );
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
            setNewPassword("");
            setCurrentPassword("");
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="mb-4">Mi Perfil</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <hr />
                        <h5>Cambiar contraseña</h5>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña actual</Form.Label>
                            <Form.Control
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                disabled={!newPassword}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nueva contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button type="submit" disabled={loading} className="w-100">
                            {loading ? "Guardando..." : "Guardar cambios"}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};
