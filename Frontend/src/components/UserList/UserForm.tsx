import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

import type { User } from "./types";

const UserForm: React.FC<{
  user: User;
  onSave: (u: User) => Promise<void>;
  onCancel: () => void;
}> = ({ user, onSave, onCancel }) => {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [role, setRole] = useState(user.role);
  const [password, setPassword] = useState(""); // New state for password

  const isCreating = user.idUser === undefined; // Determine if in create mode

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...user,
      name,
      email,
      role,
      ...(user.createdAt ? { createdAt: user.createdAt } : {}),
      ...(isCreating && password ? { password } : {}), // Add password only for new users if creating
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
      {isCreating && (
        <Form.Group className="mb-2">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required // Password is required for new users
          />
        </Form.Group>
      )}
      <Form.Group className="mb-2">
        <Form.Label>Rol</Form.Label>
        <Form.Select
          value={String(role)}
          onChange={(e) => setRole(e.target.value === "true")}
        >
          <option value="true">Admin</option>
          <option value="false">Cliente</option>
        </Form.Select>
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
