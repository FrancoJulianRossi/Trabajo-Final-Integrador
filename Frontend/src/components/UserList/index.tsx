import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Modal,
} from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import UserView from "./UserView";
import UserForm from "./UserForm";

import type { User } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000/api";

const UserList: React.FC = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<User | null>(null);
  const [editing, setEditing] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (import.meta.env.VITE_STATIC_MOCKS) {
          const res = await fetch(`/mocks/users.json`);
          const data = await res.json();
          setItems(Array.isArray(data) ? data : []);
        } else {
          const res = await fetch(`${API_BASE}/users`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (res.ok) {
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
          } else {
            setItems([]);
          }
        }
      } catch (err) {
        setItems([]);
      }
    };
    fetchUsers();
  }, [token]);

  const filtered = useMemo(() => {
    let out = items;
    if (query) {
      const q = query.toLowerCase();
      out = out.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          String(u.idUser).includes(q),
      );
    }
    if (filterRole !== "") {
      const isFilterRoleAdmin = filterRole === "true";
      out = out.filter((u) => u.role === isFilterRoleAdmin);
    }
    return out;
  }, [items, query, filterRole]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);
  const pageItems = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handleDelete = async (idUser?: number) => {
    if (idUser === undefined) {
      console.warn("handleDelete called with undefined idUser");
      return;
    }
    if (!confirm(`Confirmar eliminación del usuario #${idUser}?`)) return;
    try {
      if (import.meta.env.VITE_STATIC_MOCKS) {
        setItems((s) => s.filter((u) => u.idUser !== idUser));
        return;
      }
      const res = await fetch(`${API_BASE}/users/${idUser}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setItems((s) => s.filter((u) => u.idUser !== idUser));
      } else {
        const errorText = await res.text();
        alert(`Error al eliminar usuario: ${errorText || res.statusText}`);
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(`Error al eliminar usuario: ${err.message || "Error desconocido"}`);
    }
  };

  const handleSave = async (userToSave: User) => {
    try {
      // Determine if it's a new user by checking if idUser exists and is not a temporary client-generated ID
      const isNewUser =
        !userToSave.idUser ||
        !items.some((u) => u.idUser === userToSave.idUser);
      let res;
      if (isNewUser) {
        // Create new user (POST)
        const payload: Partial<User> = { ...userToSave };
        delete payload.idUser; // Backend assigns idUser
        delete payload.createdAt; // Backend handles createdAt

        res = await fetch(`${API_BASE}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Update existing user (PUT)
        res = await fetch(`${API_BASE}/users/${userToSave.idUser}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(userToSave),
        });
      }

      if (res.ok) {
        const savedUser = await res.json();
        if (isNewUser) {
          setItems((s) => [savedUser, ...s]);
        } else {
          setItems((s) =>
            s.map((u) => (u.idUser === savedUser.idUser ? savedUser : u)),
          );
        }
        setEditing(null); // Close modal on success
      } else {
        const errorBody = await res.json(); // Read error body as JSON
        const errorMessage = errorBody.message || res.statusText;
        alert(`Error al guardar usuario: ${errorMessage}`);
      }
    } catch (err: any) {
      console.error("Save error:", err);
      alert(`Error al guardar usuario: ${err.message || "Error desconocido"}`);
    }
  };

  const exportCSV = (list: User[]) => {
    const header = ["idUser", "name", "email", "role", "createdAt"];
    const rows = list.map((u) => [
      u.idUser,
      u.name,
      u.email,
      u.role ? "Admin" : "Client",
      u.createdAt || "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="py-4">
      <h2 className="mb-3">Usuarios</h2>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Buscar por nombre, email o id"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todos</option>
            <option value="true">Admin</option>
            <option value="false">Cliente</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </Form.Select>
        </Col>
        <Col md={3} className="text-end">
          <Button onClick={() => exportCSV(filtered)}>Exportar CSV</Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((u) => (
            <tr key={u.idUser}>
              <td>{u.idUser}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role ? "Admin" : "Client"}</td>
              <td>
                <Button size="sm" onClick={() => setSelected(u)}>
                  Ver
                </Button>{" "}
                <Button
                  size="sm"
                  variant="warning"
                  className="ms-1"
                  onClick={() => setEditing(u)}
                >
                  Editar
                </Button>{" "}
                <Button
                  size="sm"
                  variant="danger"
                  className="ms-1"
                  onClick={() => handleDelete(u.idUser)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {pageItems.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center">
                No hay registros
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Row className="align-items-center">
        <Col>
          <small>Mostrando {filtered.length} resultados</small>
        </Col>
        <Col className="text-end">
          <Button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </Button>
          <span className="mx-2">
            {page} / {totalPages}
          </span>
          <Button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </Button>
        </Col>
      </Row>

      <Modal show={!!selected} onHide={() => setSelected(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <UserView user={selected} onClose={() => setSelected(null)} />
          )}
        </Modal.Body>
      </Modal>

      <Modal show={!!editing} onHide={() => setEditing(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editing?.idUser ? "Editar Usuario" : "Nuevo Usuario"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editing && (
            <UserForm
              user={editing}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
            />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserList;
