import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Table, Form, Button, Modal, InputGroup } from "react-bootstrap";

interface Room {
  idRoom: number;
  Name: string;
  Capacity: number;
  Location?: string;
  Layout?: string;
}

export const AdminPanelRoom: React.FC = () => {
  const API_BASE = "http://127.0.0.1:3000/api";

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // search / filter / paging
  const [search, setSearch] = useState("");
  const [capacityFilter, setCapacityFilter] = useState<string>("all"); // all, small, medium, large
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  // view / edit / create
  const [viewing, setViewing] = useState<Room | null>(null);
  const [editing, setEditing] = useState<Room | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const [creatingPayload, setCreatingPayload] = useState<Partial<Room>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/rooms`);
      if (!res.ok) throw new Error("Error cargando salas");
      const json = await res.json();
      setRooms(Array.isArray(json) ? json : []);
    } catch (err: any) {
      console.error(err);
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  const capacityCounts = useMemo(() => {
    const counts = { small: 0, medium: 0, large: 0 };
    rooms.forEach((r) => {
      if (r.Capacity <= 50) counts.small++;
      else if (r.Capacity <= 100) counts.medium++;
      else counts.large++;
    });
    return counts;
  }, [rooms]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rooms.filter((r) => {
      const matchSearch =
        !q ||
        String(r.idRoom).includes(q) ||
        r.Name.toLowerCase().includes(q) ||
        (r.Location ?? "").toLowerCase().includes(q) ||
        (r.Layout ?? "").toLowerCase().includes(q);
      const matchCapacity =
        capacityFilter === "all" ||
        (capacityFilter === "small" && r.Capacity <= 50) ||
        (capacityFilter === "medium" && r.Capacity > 50 && r.Capacity <= 100) ||
        (capacityFilter === "large" && r.Capacity > 100);
      return matchSearch && matchCapacity;
    });
  }, [rooms, search, capacityFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageClamped = Math.min(Math.max(1, page), totalPages);

  useEffect(() => {
    setPage(1);
  }, [search, capacityFilter, pageSize]);

  const pageItems = filtered.slice((pageClamped - 1) * pageSize, pageClamped * pageSize);

  // view
  function openView(r: Room) {
    setViewing(r);
  }

  // edit
  function openEdit(r: Room) {
    setEditing({ ...r });
  }

  async function handleSaveEdit() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/rooms/${editing.idRoom}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      await loadAll();
      setEditing(null);
    } catch (err: any) {
      console.error("Error guardando sala:", err);
      setError(String(err?.message ?? err));
    } finally {
      setSaving(false);
    }
  }

  // create
  function openCreate() {
    setCreatingPayload({
      Name: "",
      Capacity: 0,
      Location: "",
      Layout: "",
    });
    setCreating(true);
  }

  async function handleCreateSubmit() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        Name: creatingPayload.Name,
        Capacity: creatingPayload.Capacity,
        Location: creatingPayload.Location,
        Layout: creatingPayload.Layout,
      };
      const res = await fetch(`${API_BASE}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      await loadAll();
      setCreating(false);
      setCreatingPayload({});
    } catch (err: any) {
      console.error("Create room error:", err);
      setError(String(err?.message ?? err));
    } finally {
      setSaving(false);
    }
  }

  // delete
  async function handleDelete(r: Room) {
    if (!confirm(`Confirmar eliminación de la sala #${r.idRoom} (${r.Name})?`)) return;
    try {
      const res = await fetch(`${API_BASE}/rooms/${r.idRoom}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      await loadAll();
    } catch (err: any) {
      console.error("Delete room error:", err);
      setError(String(err?.message ?? err));
      alert("Error eliminando sala: " + (err?.message ?? err));
    }
  }

  // export CSV / JSON (complete filtered set)
  function exportCsv() {
    const rows = [
      ["idRoom", "Name", "Capacity", "Location", "Layout"],
      ...filtered.map((r) => [r.idRoom, r.Name, r.Capacity, r.Location ?? "", r.Layout ?? ""]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rooms_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    const data = filtered.map((r) => ({ ...r }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rooms_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Container className="py-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h3>Administración de Salas</h3>
          <div className="text-muted">Listado, búsqueda, filtros por capacidad, edición, eliminación y reportes</div>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={openCreate} className="me-2">Crear</Button>
          <Button variant="secondary" onClick={loadAll} className="me-2" disabled={loading}>Recargar</Button>
          <Button variant="success" onClick={exportCsv} disabled={loading || filtered.length === 0} className="me-2">
            Exportar CSV ({filtered.length})
          </Button>
          <Button variant="outline-success" onClick={exportJson} disabled={loading || filtered.length === 0}>
            Exportar JSON
          </Button>
        </Col>
      </Row>

      <Row className="mb-2">
        <Col md={4}>
          <Form.Control placeholder="Buscar por id/nombre/ubicación/layout..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </Col>
        <Col md={3}>
          <Form.Select value={capacityFilter} onChange={(e) => setCapacityFilter(e.target.value)}>
            <option value="all">Todas (total {rooms.length})</option>
            <option value="small">Pequeñas ≤50 ({capacityCounts.small})</option>
            <option value="medium">Medianas 51-100 ({capacityCounts.medium})</option>
            <option value="large">Grandes &gt;100 ({capacityCounts.large})</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={String(pageSize)} onChange={(e) => setPageSize(Number(e.target.value))}>
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>{n} / pág</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3} className="text-end">
          <small className="text-muted">Mostrando {Math.min(pageSize, pageItems.length)} de {total} resultados (página {pageClamped})</small>
        </Col>
      </Row>

      {error && <Row className="mb-2"><Col><div className="alert alert-danger">{error}</div></Col></Row>}

      <Row>
        <Col>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Capacidad</th>
                <th>Ubicación</th>
                <th>Layout</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((r) => (
                <tr key={r.idRoom}>
                  <td>{r.idRoom}</td>
                  <td>{r.Name}</td>
                  <td>{r.Capacity}</td>
                  <td>{r.Location ?? "-"}</td>
                  <td>{r.Layout ?? "-"}</td>
                  <td className="text-end">
                    <Button size="sm" variant="outline-primary" className="me-1" onClick={() => openView(r)}>Ver</Button>
                    <Button size="sm" variant="outline-warning" className="me-1" onClick={() => openEdit(r)}>Edit</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(r)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted">No hay resultados</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className="align-items-center">
        <Col>
          <div className="d-flex gap-2 align-items-center">
            <Button size="sm" onClick={() => setPage(1)} disabled={pageClamped === 1}>Primera</Button>
            <Button size="sm" onClick={() => setPage(pageClamped - 1)} disabled={pageClamped === 1}>Anterior</Button>
            <InputGroup size="sm" style={{ width: 120 }}>
              <Form.Control type="number" value={pageClamped} min={1} max={totalPages} onChange={(e) => setPage(Number(e.target.value || 1))} />
              <InputGroup.Text>/ {totalPages}</InputGroup.Text>
            </InputGroup>
            <Button size="sm" onClick={() => setPage(pageClamped + 1)} disabled={pageClamped === totalPages}>Siguiente</Button>
            <Button size="sm" onClick={() => setPage(totalPages)} disabled={pageClamped === totalPages}>Última</Button>
          </div>
        </Col>
        <Col className="text-end text-muted">Página {pageClamped} de {totalPages}</Col>
      </Row>

      {/* View modal */}
      <Modal show={!!viewing} onHide={() => setViewing(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle de sala</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewing && (
            <>
              <Row>
                <Col md={8}>
                  <h5>Sala #{viewing.idRoom} - {viewing.Name}</h5>
                  <p><strong>Capacidad:</strong> {viewing.Capacity}</p>
                  <p><strong>Ubicación:</strong> {viewing.Location ?? "-"}</p>
                  <p><strong>Layout:</strong> {viewing.Layout ?? "-"}</p>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewing(null)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit modal */}
      <Modal show={!!editing} onHide={() => setEditing(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editing ? `Editar sala #${editing.idRoom}` : "Editar"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editing && (
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Nombre</Form.Label>
                <Form.Control value={editing.Name ?? ""} onChange={(e) => setEditing({ ...editing, Name: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Capacidad</Form.Label>
                <Form.Control type="number" value={editing.Capacity ?? 0} onChange={(e) => setEditing({ ...editing, Capacity: Number(e.target.value) })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Ubicación</Form.Label>
                <Form.Control value={editing.Location ?? ""} onChange={(e) => setEditing({ ...editing, Location: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Layout</Form.Label>
                <Form.Control value={editing.Layout ?? ""} onChange={(e) => setEditing({ ...editing, Layout: e.target.value })} />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditing(null)} disabled={saving}>Cancelar</Button>
          <Button variant="primary" onClick={handleSaveEdit} disabled={saving}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* Create modal */}
      <Modal show={creating} onHide={() => setCreating(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Crear nueva sala</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control value={creatingPayload.Name ?? ""} onChange={(e) => setCreatingPayload({ ...creatingPayload, Name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control type="number" value={creatingPayload.Capacity ?? 0} onChange={(e) => setCreatingPayload({ ...creatingPayload, Capacity: Number(e.target.value) })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control value={creatingPayload.Location ?? ""} onChange={(e) => setCreatingPayload({ ...creatingPayload, Location: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Layout</Form.Label>
              <Form.Control value={creatingPayload.Layout ?? ""} onChange={(e) => setCreatingPayload({ ...creatingPayload, Layout: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setCreating(false)} disabled={saving}>Cancelar</Button>
          <Button variant="primary" onClick={handleCreateSubmit} disabled={saving}>Crear</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPanelRoom;