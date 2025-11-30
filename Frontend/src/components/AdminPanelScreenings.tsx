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

interface Movie {
  IdMovie: number;
  Name: string;
  Description: string;
  Length: number;
  Genre: string;
  Director: string;
  Poster: string;
}

interface Screening {
  idScreening: number;
  movieId?: number;
  date: string; // ISO date or date string
  start: string; // ISO or time
  end?: string;
  ticketPrice: number;
}

export const AdminPanelScreenings: React.FC = () => {
  const API_BASE = "http://127.0.0.1:3000/api";
  const USE_STATIC = Boolean(import.meta.env.VITE_STATIC_MOCKS);

  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
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
    {}
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      if (USE_STATIC) {
        const moviesJson = await (await fetch(`/mocks/movies.json`)).json();
        const screeningsJson = await (
          await fetch(`/mocks/screenings.json`)
        ).json();
        setMovies(Array.isArray(moviesJson) ? moviesJson : []);
        setScreenings(Array.isArray(screeningsJson) ? screeningsJson : []);
      } else {
        const [mRes, sRes] = await Promise.all([
          fetch(`${API_BASE}/movies`),
          fetch(`${API_BASE}/screenings`),
        ]);
        if (!mRes.ok) throw new Error("Error cargando películas");
        if (!sRes.ok) throw new Error("Error cargando funciones");
        const moviesJson = await mRes.json();
        const screeningsJson = await sRes.json();
        setMovies(Array.isArray(moviesJson) ? moviesJson : []);
        setScreenings(Array.isArray(screeningsJson) ? screeningsJson : []);
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
      const movie = movies.find((m) => m.IdMovie === s.movieId);
      const movieName = movie?.Name?.toLowerCase() ?? "";
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
  }, [screenings, movies, search, movieFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageClamped = Math.min(Math.max(1, page), totalPages);

  useEffect(() => {
    setPage(1);
  }, [search, movieFilter, pageSize]);

  const pageItems = filtered.slice(
    (pageClamped - 1) * pageSize,
    pageClamped * pageSize
  );

  // view
  function openView(s: Screening) {
    setViewing(s);
  }

  // edit
  function openEdit(s: Screening) {
    setEditing({ ...s });
  }

  async function handleSaveEdit() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      if (USE_STATIC) {
        setScreenings((s) =>
          s.map((it) => (it.idScreening === editing.idScreening ? editing : it))
        );
        setEditing(null);
      } else {
        const res = await fetch(
          `${API_BASE}/screenings/${editing.idScreening}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editing),
          }
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
      movieId: movies.length > 0 ? movies[0].IdMovie : undefined,
      date: new Date().toISOString().slice(0, 10),
      start: new Date().toISOString(),
      ticketPrice: 0,
    });
    setCreating(true);
  }

  async function handleCreateSubmit() {
    setSaving(true);
    setError(null);
    try {
      const payload: any = {
        movieId: creatingPayload.movieId,
        date: creatingPayload.date,
        start: creatingPayload.start,
        end: creatingPayload.end,
        ticketPrice: creatingPayload.ticketPrice,
      };
      if (USE_STATIC) {
        const created: Screening = {
          idScreening: Date.now(),
          movieId: payload.movieId,
          date: payload.date,
          start: payload.start,
          end: payload.end,
          ticketPrice: payload.ticketPrice,
        };
        setScreenings((s) => [created, ...s]);
        setCreating(false);
        setCreatingPayload({});
      } else {
        const res = await fetch(`${API_BASE}/screenings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        // refresh
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
          p.filter((it) => it.idScreening !== s.idScreening)
        );
        return;
      }
      const res = await fetch(`${API_BASE}/screenings/${s.idScreening}`, {
        method: "DELETE",
      });
      if (!res.ok) {
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
        const movie = movies.find((m) => m.IdMovie === s.movieId);
        return [
          s.idScreening,
          s.movieId ?? "",
          movie?.Name ?? "",
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
      const movie = movies.find((m) => m.IdMovie === s.movieId);
      return { ...s, movieName: movie?.Name ?? null };
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
            variant="secondary"
            onClick={loadAll}
            className="me-2"
            disabled={loading}
          >
            Recargar
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
              <option key={m.IdMovie} value={String(m.IdMovie)}>
                {m.Name}
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
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((s) => {
                const movie = movies.find((m) => m.IdMovie === s.movieId);
                return (
                  <tr key={s.idScreening}>
                    <td>{s.idScreening}</td>
                    <td>{movie ? movie.Name : `#${s.movieId}`}</td>
                    <td>{new Date(s.date).toLocaleDateString()}</td>
                    <td>{new Date(s.start).toLocaleTimeString()}</td>
                    <td>
                      {s.end ? new Date(s.end).toLocaleTimeString() : "-"}
                    </td>
                    <td>${s.ticketPrice}</td>
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
                  <td colSpan={7} className="text-center text-muted">
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
        <Modal.Body>
          {viewing && (
            <>
              <Row>
                <Col md={8}>
                  <h5>Función #{viewing.idScreening}</h5>
                  <p>
                    <strong>Película:</strong>{" "}
                    {movies.find((m) => m.IdMovie === viewing.movieId)?.Name ??
                      viewing.movieId}
                  </p>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(viewing.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Inicio:</strong>{" "}
                    {new Date(viewing.start).toLocaleTimeString()}
                  </p>
                  <p>
                    <strong>Fin:</strong>{" "}
                    {viewing.end
                      ? new Date(viewing.end).toLocaleTimeString()
                      : "-"}
                  </p>
                  <p>
                    <strong>Precio:</strong> ${viewing.ticketPrice}
                  </p>
                </Col>
                <Col md={4}>
                  {movies.find((m) => m.IdMovie === viewing.movieId)
                    ?.Poster && (
                    <img
                      src={
                        movies.find((m) => m.IdMovie === viewing.movieId)!
                          .Poster
                      }
                      alt="poster"
                      style={{ maxWidth: "100%", borderRadius: 6 }}
                    />
                  )}
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewing(null)}>
            Cerrar
          </Button>
        </Modal.Footer>
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
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Película</Form.Label>
                <Form.Select
                  value={String(editing.movieId ?? "")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      movieId: Number(e.target.value || 0),
                    })
                  }
                >
                  <option value="">-- seleccionar --</option>
                  {movies.map((m) => (
                    <option key={m.IdMovie} value={m.IdMovie}>
                      {m.Name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  value={editing.date ? editing.date.slice(0, 10) : ""}
                  onChange={(e) =>
                    setEditing({ ...editing, date: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Hora Inicio</Form.Label>
                <Form.Control
                  type="time"
                  value={
                    editing.start
                      ? new Date(editing.start).toISOString().slice(11, 16)
                      : ""
                  }
                  onChange={(e) => {
                    const datePart = (
                      editing.date || new Date().toISOString()
                    ).slice(0, 10);
                    const iso = new Date(
                      `${datePart}T${e.target.value}:00`
                    ).toISOString();
                    setEditing({ ...editing, start: iso });
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Hora Fin</Form.Label>
                <Form.Control
                  type="time"
                  value={
                    editing.end
                      ? new Date(editing.end).toISOString().slice(11, 16)
                      : ""
                  }
                  onChange={(e) => {
                    const datePart = (
                      editing.date || new Date().toISOString()
                    ).slice(0, 10);
                    const iso = new Date(
                      `${datePart}T${e.target.value}:00`
                    ).toISOString();
                    setEditing({ ...editing, end: iso });
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  value={editing.ticketPrice ?? 0}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      ticketPrice: Number(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setEditing(null)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveEdit} disabled={saving}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create modal */}
      <Modal show={creating} onHide={() => setCreating(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Crear nueva función</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Película</Form.Label>
              <Form.Select
                value={String(creatingPayload.movieId ?? "")}
                onChange={(e) =>
                  setCreatingPayload({
                    ...creatingPayload,
                    movieId: Number(e.target.value || 0),
                  })
                }
              >
                <option value="">-- seleccionar --</option>
                {movies.map((m) => (
                  <option key={m.IdMovie} value={m.IdMovie}>
                    {m.Name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={(creatingPayload.date ?? "").slice(0, 10)}
                onChange={(e) =>
                  setCreatingPayload({
                    ...creatingPayload,
                    date: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Hora Inicio</Form.Label>
              <Form.Control
                type="time"
                value={
                  creatingPayload.start
                    ? new Date(creatingPayload.start)
                        .toISOString()
                        .slice(11, 16)
                    : ""
                }
                onChange={(e) => {
                  const datePart = (
                    creatingPayload.date || new Date().toISOString()
                  ).slice(0, 10);
                  const iso = new Date(
                    `${datePart}T${e.target.value}:00`
                  ).toISOString();
                  setCreatingPayload({ ...creatingPayload, start: iso });
                }}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Hora Fin</Form.Label>
              <Form.Control
                type="time"
                value={
                  creatingPayload.end
                    ? new Date(creatingPayload.end).toISOString().slice(11, 16)
                    : ""
                }
                onChange={(e) => {
                  const datePart = (
                    creatingPayload.date || new Date().toISOString()
                  ).slice(0, 10);
                  const iso = new Date(
                    `${datePart}T${e.target.value}:00`
                  ).toISOString();
                  setCreatingPayload({ ...creatingPayload, end: iso });
                }}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                value={creatingPayload.ticketPrice ?? 0}
                onChange={(e) =>
                  setCreatingPayload({
                    ...creatingPayload,
                    ticketPrice: Number(e.target.value),
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setCreating(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateSubmit}
            disabled={saving}
          >
            Crear
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPanelScreenings;
