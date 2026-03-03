import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Button,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import type { Screening, Movie, Room } from "./types";
import ScreeningView from "./ScreeningView";
import ScreeningForm from "./ScreeningForm";

export const AdminPanelScreenings: React.FC = () => {
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000/api";
  const USE_STATIC = Boolean(import.meta.env.VITE_STATIC_MOCKS);
  const { token } = useAuth();

  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters / search / paging
  const [search, setSearch] = useState("");
  const [movieFilter, setMovieFilter] = useState<string>("all");
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  // view / edit / create modals
  const [viewing, setViewing] = useState<Screening | null>(null);
  const [editing, setEditing] = useState<Screening | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const [creatingPayload, setCreatingPayload] = useState<Partial<Screening>>(
    {},
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll();
  }, [token]);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      if (USE_STATIC) {
        const moviesJson = await (await fetch(`/mocks/movies.json`)).json();
        const screeningsJson = await (
          await fetch(`/mocks/screenings.json`)
        ).json();
        const roomsJson = await (await fetch(`/mocks/rooms.json`)).json();
        setMovies(Array.isArray(moviesJson) ? moviesJson : []);
        setScreenings(Array.isArray(screeningsJson) ? screeningsJson : []);
        setRooms(Array.isArray(roomsJson) ? roomsJson : []);
      } else {
        const [mRes, sRes, rRes] = await Promise.all([
          fetch(`${API_BASE}/movies`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch(`${API_BASE}/screenings`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch(`${API_BASE}/rooms`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);
        if (!mRes.ok) throw new Error("Error cargando películas");
        if (!sRes.ok) throw new Error("Error cargando funciones");
        if (!rRes.ok) throw new Error("Error cargando salas");
        const moviesJson = await mRes.json();
        const screeningsJson = await sRes.json();
        const roomsJson = await rRes.json();
        setMovies(Array.isArray(moviesJson) ? moviesJson : []);
        setScreenings(Array.isArray(screeningsJson) ? screeningsJson : []);
        setRooms(Array.isArray(roomsJson) ? roomsJson : []);
      }
    } catch (err: any) {
      console.error(err);
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  // derived filtered list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return screenings.filter((s) => {
      const movie = movies.find((m) => m.idMovie === s.movieId);
      const movieName = movie?.name?.toLowerCase() ?? "";
      const matchSearch =
        !q ||
        String(s.idScreening).includes(q) ||
        movieName.includes(q) ||
        (s.date || "").toLowerCase().includes(q) ||
        (s.start || "").toLowerCase().includes(q);
      const matchMovie =
        movieFilter === "all" || String(s.movieId) === movieFilter;
      return matchSearch && matchMovie;
    });
  }, [screenings, movies, rooms, search, movieFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageClamped = Math.min(Math.max(1, page), totalPages);

  useEffect(() => {
    setPage(1);
  }, [search, movieFilter, pageSize]);

  const pageItems = filtered.slice(
    (pageClamped - 1) * pageSize,
    pageClamped * pageSize,
  );

  // view
  function openView(s: Screening) {
    setViewing(s);
  }

  // edit
  function openEdit(s: Screening) {
    setEditing({ ...s });
  }

  async function handleSaveEdit(data: Partial<Screening>) {
    if (!editing) return;
    const toSave = { ...editing, ...data };
    setSaving(true);
    setError(null);
    try {
      if (USE_STATIC) {
        setScreenings((s) =>
          s.map((it) => (it.idScreening === toSave.idScreening ? toSave : it)),
        );
        setEditing(null);
      } else {
        const res = await fetch(
          `${API_BASE}/screenings/${toSave.idScreening}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(toSave),
          },
        );
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        // refresh
        await loadAll();
        setEditing(null);
      }
    } catch (err: any) {
      console.error("Error guardando:", err);
      setError(String(err?.message ?? err));
    } finally {
      setSaving(false);
    }
  }

  // create
  function openCreate() {
    setCreatingPayload({
      movieId: movies.length > 0 ? movies[0].idMovie : undefined,
      roomId: rooms.length > 0 ? rooms[0].idRoom : undefined,
      date: new Date().toISOString().slice(0, 10),
      start: new Date().toISOString(),
      ticketPrice: 0,
    });
    setCreating(true);
  }

  async function handleCreateSubmit(data: Partial<Screening>) {
    setSaving(true);
    setError(null);
    try {
      if (USE_STATIC) {
        // in static mode we know the form fills all required fields,
        // but the compiler sees `data` as Partial<Screening> so fields
        // might be undefined. use non-null assertions or defaults here.
        const created: Screening = {
          idScreening: Date.now(),
          movieId: data.movieId!,
          roomId: data.roomId!,
          date: data.date || "", // should never be empty
          start: data.start || "", // should never be empty
          end: data.end,
          ticketPrice: data.ticketPrice ?? 0,
        };
        setScreenings((s) => [created, ...s]);
        setCreating(false);
        setCreatingPayload({});
      } else {
        const res = await fetch(`${API_BASE}/screenings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        await loadAll();
        setCreating(false);
        setCreatingPayload({});
      }
    } catch (err: any) {
      console.error("Create error:", err);
      setError(String(err?.message ?? err));
    } finally {
      setSaving(false);
    }
  }

  // delete
  async function handleDelete(s: Screening) {
    if (!confirm(`Confirmar eliminación de la función #${s.idScreening}?`))
      return;
    try {
      if (USE_STATIC) {
        setScreenings((p) =>
          p.filter((it) => it.idScreening !== s.idScreening),
        );
        return;
      }
      const res = await fetch(`${API_BASE}/screenings/${s.idScreening}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        // Check for 409 Conflict status
        if (res.status === 409) {
          const errorBody = await res.json();
          alert(`Error: ${errorBody.message}`);
          return;
        }
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      await loadAll();
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(String(err?.message ?? err));
      alert("Error eliminando: " + (err?.message ?? err));
    }
  }

  // export CSV for current filtered list (all filtered, not only page)
  function exportCsv() {
    const rows = [
      [
        "idScreening",
        "movieId",
        "movieName",
        "date",
        "start",
        "end",
        "ticketPrice",
      ],
      ...filtered.map((s) => {
        const movie = movies.find((m) => m.idMovie === s.movieId);
        return [
          s.idScreening,
          s.movieId ?? "",
          movie?.name ?? "",
          s.date ?? "",
          s.start ?? "",
          s.end ?? "",
          s.ticketPrice ?? "",
        ];
      }),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `screenings_export_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // export JSON (complete filtered)
  function exportJson() {
    const data = filtered.map((s) => {
      const movie = movies.find((m) => m.idMovie === s.movieId);
      return { ...s, movieName: movie?.name ?? null };
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `screenings_export_${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Container className="py-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h3>Administración de Funciones</h3>
          <div className="text-muted">
            Listado, búsqueda, filtros, edición, eliminación y reportes
          </div>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={openCreate} className="me-2">
            Crear
          </Button>
          <Button
            variant="success"
            onClick={exportCsv}
            disabled={loading || filtered.length === 0}
            className="me-2"
          >
            Exportar CSV ({filtered.length})
          </Button>
          <Button
            variant="outline-success"
            onClick={exportJson}
            disabled={loading || filtered.length === 0}
          >
            Exportar JSON
          </Button>
        </Col>
      </Row>

      <Row className="mb-2">
        <Col md={4}>
          <Form.Control
            placeholder="Buscar por id/película/fecha/hora..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={movieFilter}
            onChange={(e) => setMovieFilter(e.target.value)}
          >
            <option value="all">Todas las películas</option>
            {movies.map((m) => (
              <option key={m.idMovie} value={String(m.idMovie)}>
                {m.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select
            value={String(pageSize)}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / pág
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3} className="text-end">
          <small className="text-muted">
            Mostrando {Math.min(pageSize, pageItems.length)} de {total}{" "}
            resultados (página {pageClamped})
          </small>
        </Col>
      </Row>

      {error && (
        <Row className="mb-2">
          <Col>
            <div className="alert alert-danger">{error}</div>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Película</th>
                <th>Fecha</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Precio</th>
                <th>Sala</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((s) => {
                const movie = movies.find((m) => m.idMovie === s.movieId);
                const room = rooms.find((r) => r.idRoom === s.roomId);
                return (
                  <tr key={s.idScreening}>
                    <td>{s.idScreening}</td>
                    <td>{movie ? movie.name : `#${s.movieId}`}</td>
                    <td>{s.date}</td>
                    <td>{new Date(s.start).toLocaleTimeString()}</td>
                    <td>
                      {s.end ? new Date(s.end).toLocaleTimeString() : "-"}
                    </td>
                    <td>${s.ticketPrice}</td>
                    <td>{room ? room.name : `#${s.roomId}`}</td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-1"
                        onClick={() => openView(s)}
                      >
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-warning"
                        className="me-1"
                        onClick={() => openEdit(s)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(s)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted">
                    No hay resultados
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className="align-items-center">
        <Col>
          <div className="d-flex gap-2 align-items-center">
            <Button
              size="sm"
              onClick={() => setPage(1)}
              disabled={pageClamped === 1}
            >
              Primera
            </Button>
            <Button
              size="sm"
              onClick={() => setPage(pageClamped - 1)}
              disabled={pageClamped === 1}
            >
              Anterior
            </Button>
            <InputGroup size="sm" style={{ width: 120 }}>
              <Form.Control
                type="number"
                value={pageClamped}
                min={1}
                max={totalPages}
                onChange={(e) => setPage(Number(e.target.value || 1))}
              />
              <InputGroup.Text>/ {totalPages}</InputGroup.Text>
            </InputGroup>
            <Button
              size="sm"
              onClick={() => setPage(pageClamped + 1)}
              disabled={pageClamped === totalPages}
            >
              Siguiente
            </Button>
            <Button
              size="sm"
              onClick={() => setPage(totalPages)}
              disabled={pageClamped === totalPages}
            >
              Última
            </Button>
          </div>
        </Col>
        <Col className="text-end text-muted">
          Página {pageClamped} de {totalPages}
        </Col>
      </Row>

      {/* View modal */}
      <Modal show={!!viewing} onHide={() => setViewing(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle de función</Modal.Title>
        </Modal.Header>
        {viewing && (
          <ScreeningView
            screening={viewing}
            movie={movies.find((m) => m.idMovie === viewing.movieId)}
            onClose={() => setViewing(null)}
          />
        )}
      </Modal>

      {/* Edit modal */}
      <Modal show={!!editing} onHide={() => setEditing(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editing ? `Editar función #${editing.idScreening}` : "Editar"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editing && (
            <ScreeningForm
              initialData={editing}
              movies={movies}
              rooms={rooms} // Pass rooms here
              onSave={handleSaveEdit}
              onCancel={() => setEditing(null)}
              saving={saving}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Create modal */}
      <Modal show={creating} onHide={() => setCreating(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Crear nueva función</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ScreeningForm
            initialData={creatingPayload}
            movies={movies}
            rooms={rooms} // Pass rooms here
            onSave={handleCreateSubmit}
            onCancel={() => setCreating(false)}
            saving={saving}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminPanelScreenings;
