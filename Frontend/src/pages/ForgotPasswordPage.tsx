import React, { useState } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setResetToken("");
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      const token = response?.token || "";
      setResetToken(token);
      setMessage(
        token
          ? "Se genero un token de recuperacion. Copialo y usalo para cambiar la contrasena."
          : "Si el correo existe, se envio un enlace de recuperacion.",
      );
    } catch (err: any) {
      setError(
        err?.message || "No se pudo iniciar la recuperacion de contrasena.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={5}>
          <h2 className="mb-4 text-center">Recuperar Contrasena</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Correo electronico</Form.Label>
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

          {resetToken && (
            <div className="mt-3">
              <Form.Group className="mb-2">
                <Form.Label>Token de recuperacion</Form.Label>
                <Form.Control type="text" value={resetToken} readOnly />
              </Form.Group>
              <Link to={`/reset-password?token=${encodeURIComponent(resetToken)}`}>
                Ir a cambiar contrasena con este token
              </Link>
            </div>
          )}

          <div className="mt-3 text-center">
            <Link to="/login">Volver al inicio de sesion</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
