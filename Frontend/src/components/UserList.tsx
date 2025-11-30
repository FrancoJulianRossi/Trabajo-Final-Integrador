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
import UserView from "./UserView";
import UserForm from "./UserForm";

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
}

const API_BASE = "http://127.0.0.1:3000/api";

const UserList: React.FC = () => {
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
          const res = await fetch(`${API_BASE}/users`);
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
  }, []);

  const filtered = useMemo(() => {
    let out = items;
    if (query) {
      const q = query.toLowerCase();
      out = out.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          String(u.id).includes(q)
      );
    }
    if (filterRole)
      out = out.filter(
        (u) => (u.role || "").toLowerCase() === filterRole.toLowerCase()
      );
    return out;
  }, [items, query, filterRole]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);
  const pageItems = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleDelete = async (id: number) => {
    try {
      if (import.meta.env.VITE_STATIC_MOCKS) {
        setItems((s) => s.filter((u) => u.id !== id));
        return;
      }
      const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
      if (res.ok) setItems((s) => s.filter((u) => u.id !== id));
      else setItems((s) => s.filter((u) => u.id !== id));
    } catch (err) {
      setItems((s) => s.filter((u) => u.id !== id));
    }
  };

  const handleSave = (u: User) => {
    const exists = items.find((i) => i.id === u.id);
    if (exists) setItems((s) => s.map((i) => (i.id === u.id ? u : i)));
    else setItems((s) => [u, ...s]);
    setEditing(null);
  };

  const exportCSV = (list: User[]) => {
    const header = ["id", "name", "email", "role", "createdAt"];
    const rows = list.map((u) => [
      u.id,
      u.name,
      u.email,
      u.role || "",
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
          <Form.Control
            placeholder="Filtrar por rol"
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setPage(1);
            }}
          />
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
          <Button
            className="ms-2"
            onClick={() =>
              setEditing({
                id: Date.now(),
                name: "",
                email: "",
                role: "",
                createdAt: new Date().toISOString(),
              })
            }
          >
            Nuevo
          </Button>
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
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
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
                  onClick={() => handleDelete(u.id)}
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
            {editing?.id ? "Editar Usuario" : "Nuevo Usuario"}
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
