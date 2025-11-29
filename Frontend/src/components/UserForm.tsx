import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
}

const UserForm: React.FC<{
  user: User;
  onSave: (u: User) => void;
  onCancel: () => void;
}> = ({ user, onSave, onCancel }) => {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [role, setRole] = useState(user.role || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...user,
      name,
      email,
      role,
      createdAt: user.createdAt || new Date().toISOString(),
    };
    onSave(updated);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-2">
        <Form.Label>Nombre</Form.Label>
        <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Rol</Form.Label>
        <Form.Control value={role} onChange={(e) => setRole(e.target.value)} />
      </Form.Group>
      <div className="text-end">
        <Button variant="secondary" onClick={onCancel} className="me-2">
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </Form>
  );
};

export default UserForm;
