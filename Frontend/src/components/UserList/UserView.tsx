import React from "react";
import { Button } from "react-bootstrap";

import type { User } from "./types";

const UserView: React.FC<{ user: User; onClose: () => void }> = ({
  user,
  onClose,
}) => {
  return (
    <div>
      <h5>
        {user.name} (#{user.idUser})
      </h5>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Rol:</strong> {user.role ? "Admin" : "Client"}
      </p>
      <p>
        <small>Creado: {user.createdAt}</small>
      </p>
      <div className="text-end">
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  );
};

export default UserView;
