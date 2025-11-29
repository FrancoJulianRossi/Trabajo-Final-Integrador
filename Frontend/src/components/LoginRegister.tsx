import React, { useState } from "react";
import {
    Card,
    Form,
    Button,
    Alert,
    Container,
    Row,
    Col,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

export const LoginRegister: React.FC<{ onClose?: () => void }> = ({
    onClose,
}) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
            onClose?.();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={5}>
                    <Card className="shadow-lg border-0">
                        <Card.Body className="p-5">
                            <h2 className="mb-4 text-center fw-bold text-primary">
                                {isLogin ? "🎫 Inicia Sesión" : "📝 Crear Cuenta"}
                            </h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                {!isLogin && (
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Tu nombre"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                )}
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Correo</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={loading}
                                    className="w-100 fw-bold mb-3"
                                >
                                    {loading
                                        ? "Cargando..."
                                        : isLogin
                                            ? "Ingresar"
                                            : "Crear Cuenta"}
                                </Button>
                            </Form>
                            <Button
                                variant="outline-secondary"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError("");
                                }}
                                className="w-100 fw-bold"
                            >
                                {isLogin
                                    ? "¿No tienes cuenta? Registrarse"
                                    : "¿Ya tienes cuenta? Ingresar"}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};