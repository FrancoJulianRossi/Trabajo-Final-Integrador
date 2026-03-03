import React, { useState } from "react";
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
  const query = useQuery();
  const queryToken = query.get("token") || "";
  const [tokenInput, setTokenInput] = useState(queryToken);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const token = tokenInput.trim();
    if (!token) {
      setError("Debes ingresar el token de recuperacion.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Las contrasenas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setMessage("Contrasena actualizada. Ya puedes iniciar sesion.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err?.message || "No se pudo restablecer la contrasena.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={5}>
          <h2 className="mb-4 text-center">Restablecer Contrasena</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          {!message && (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Token de recuperacion</Form.Label>
                <Form.Control
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Pega aqui el token"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nueva contrasena</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirmar contrasena</Form.Label>
                <Form.Control
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </Form.Group>
              <Button type="submit" className="w-100" disabled={loading}>
                {loading ? "Actualizando..." : "Cambiar contrasena"}
              </Button>
            </Form>
          )}

          <div className="mt-3 text-center">
            <Link to="/login">Volver al inicio de sesion</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
