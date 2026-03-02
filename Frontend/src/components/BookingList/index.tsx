import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Modal,
  Alert,
} from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import BookingView from "./BookingView";
import BookingForm from "./BookingForm";

import type { Reservation, Screening, User } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000/api";

const BookingList: React.FC = () => {
  const { token, user } = useAuth();
  const [items, setItems] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");

  const isCreating =
    !!editing &&
    !items.some((i) => i.idReservation === editing.idReservation);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        if (import.meta.env.VITE_STATIC_MOCKS) {
          const res = await fetch(`/mocks/bookings.json`);
          const data = await res.json();
          setItems(Array.isArray(data) ? data : []);
        } else {
          let url = `${API_BASE}/bookings`;
          if (user?.role === true) {
            url = `${API_BASE}/bookings/admin`;
          }
          const res = await fetch(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (res.ok) {
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
          } else {
            setItems([]);
          }
        }
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [token, user?.role]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [usersRes, screeningsRes] = await Promise.all([
          fetch(`${API_BASE}/users`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch(`${API_BASE}/screenings`),
        ]);

        const usersData = usersRes.ok ? await usersRes.json() : [];
        const screeningsData = screeningsRes.ok ? await screeningsRes.json() : [];
        setUsers(Array.isArray(usersData) ? usersData : []);
        setScreenings(Array.isArray(screeningsData) ? screeningsData : []);
      } catch {
        setUsers([]);
        setScreenings([]);
      }
    };

    fetchFormData();
  }, [token]);

  const filtered = useMemo(() => {
    let out = items;
    if (query) {
      const q = query.toLowerCase();
      out = out.filter(
        (r) =>
          (r.user?.name || "").toLowerCase().includes(q) ||
          String(r.idReservation).includes(q),
      );
    }
    if (filterDate) {
      out = out.filter((r) => r.screening?.date?.startsWith(filterDate));
    }
    return out;
  }, [items, query, filterDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageItems = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handleDelete = async (idReservation: number) => {
    if (!window.confirm("Confirma eliminar la reserva?")) {
      return;
    }

    try {
      if (import.meta.env.VITE_STATIC_MOCKS) {
        setItems((s) => s.filter((i) => i.idReservation !== idReservation));
        return;
      }
      const res = await fetch(`${API_BASE}/bookings/${idReservation}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setItems((s) => s.filter((i) => i.idReservation !== idReservation));
      } else {
        const text = await res.text();
        alert(`No se pudo eliminar la reserva: ${text || res.status}`);
      }
    } catch {
      alert("Error de conexion al eliminar la reserva.");
    }
  };

  const handleSave = async (updated: Reservation) => {
    setSaveError("");
    setSaveLoading(true);

    const exists = items.find((i) => i.idReservation === updated.idReservation);
    if (exists) {
      try {
        if (import.meta.env.VITE_STATIC_MOCKS) {
          setItems((s) =>
            s.map((i) =>
              i.idReservation === updated.idReservation ? updated : i,
            ),
          );
        } else {
          const seatsPayload = (updated.reservationSeats || []).map((rs) => ({
            row: rs.seat.row,
            column: rs.seat.column,
          }));

          const res = await fetch(
            `${API_BASE}/bookings/${updated.idReservation}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({ seats: seatsPayload }),
            },
          );

          if (res.ok) {
            const savedData = await res.json();
            setItems((s) =>
              s.map((i) =>
                i.idReservation === updated.idReservation ? savedData : i,
              ),
            );
          } else {
            const text = await res.text();
            setSaveError(text || "Error al actualizar la reserva.");
            setSaveLoading(false);
            return;
          }
        }
      } catch {
        setSaveError("Error de conexion al actualizar la reserva.");
        setSaveLoading(false);
        return;
      }
    } else {
      try {
        if (import.meta.env.VITE_STATIC_MOCKS) {
          setItems((s) => [updated, ...s]);
        } else {
          const seatsPayload = (updated.reservationSeats || []).map((rs) => ({
            row: rs.seat.row,
            column: rs.seat.column,
          }));

          const res = await fetch(`${API_BASE}/bookings`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              userId: updated.userId,
              screening: updated.screening,
              seats: seatsPayload,
            }),
          });
          if (res.ok) {
            const created = await res.json();
            const hydrated: Reservation = {
              ...updated,
              ...created,
              idReservation: created?.idReservation ?? updated.idReservation,
              userId: created?.userId ?? updated.userId,
              user:
                created?.user ||
                updated.user ||
                users.find((u) => u.idUser === (created?.userId ?? updated.userId)),
              screeningId: created?.screeningId ?? updated.screeningId,
              screening:
                created?.screening ||
                updated.screening ||
                screenings.find(
                  (s) =>
                    s.idScreening ===
                    (created?.screeningId ?? updated.screeningId),
                ) ||
                updated.screening,
              reservationSeats:
                created?.reservationSeats || updated.reservationSeats || [],
              reservationDate:
                created?.reservationDate || updated.reservationDate || "",
              status: created?.status || updated.status || "Confirmed",
              total: created?.total ?? updated.total ?? 0,
            };
            setItems((s) => [hydrated, ...s]);
          } else {
            const text = await res.text();
            setSaveError(`Error creando reserva: ${text || res.status}`);
            setSaveLoading(false);
            return;
          }
        }
      } catch {
        setSaveError("Error de conexion al crear reserva.");
        setSaveLoading(false);
        return;
      }
    }

    setSaveLoading(false);
    setEditing(null);
  };

  const exportCSV = (list: Reservation[]) => {
    const header = [
      "idReservation",
      "userName",
      "movie",
      "screeningDate",
      "start",
      "seats",
      "reservationDate",
    ];
    const rows = list.map((r) => [
      r.idReservation,
      r.user?.name ?? "",
      r.screening?.movie?.name ?? "N/A",
      r.screening?.date ?? "",
      r.screening?.start ?? "",
      (r.reservationSeats || [])
        .map(
          (rs) => `${String.fromCharCode(64 + rs.seat.row)}${rs.seat.column}`,
        )
        .join("|") || "",
      r.reservationDate || "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="py-4">
      <h2 className="mb-3">Reservas</h2>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Buscar por nombre o id"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="date"
            value={filterDate}
            onChange={(e) => {
              setFilterDate(e.target.value);
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
          <Button variant="secondary" onClick={() => exportCSV(filtered)}>
            Exportar CSV
          </Button>
          <Button
            className="ms-2"
            onClick={() =>
              setEditing({
                idReservation: 0,
                userId: 0,
                screeningId: 0,
                screening: {
                  idScreening: 0,
                  movieId: 0,
                  roomId: 0,
                  date: new Date().toISOString().split("T")[0],
                  start: "",
                  end: "",
                  ticketPrice: 0,
                },
                reservationSeats: [],
                reservationDate: new Date().toISOString(),
                status: "Pending",
                total: 0,
              } as Reservation)
            }
          >
            Nueva reserva
          </Button>
        </Col>
      </Row>

      {saveError && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" className="mb-0">
              {saveError}
            </Alert>
          </Col>
        </Row>
      )}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Pelicula</th>
            <th>Fecha</th>
            <th>Inicio</th>
            <th>Asientos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((r) => (
            <tr key={r.idReservation}>
              <td>{r.idReservation}</td>
              <td>{r.user?.name || `#${r.userId}`}</td>
              <td>{r.screening?.movie?.name}</td>
              <td>{r.screening?.date}</td>
              <td>{r.screening?.start}</td>
              <td>
                {(r.reservationSeats || [])
                  .map(
                    (rs) =>
                      `${String.fromCharCode(64 + rs.seat.row)}${rs.seat.column}`,
                  )
                  .join(", ")}
              </td>
              <td>
                <Button size="sm" onClick={() => setSelected(r)}>
                  Ver
                </Button>{" "}
                <Button
                  size="sm"
                  variant="warning"
                  className="ms-1"
                  onClick={() => setEditing(r)}
                >
                  Editar
                </Button>{" "}
                <Button
                  size="sm"
                  variant="danger"
                  className="ms-1"
                  onClick={() => handleDelete(r.idReservation)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {!loading && pageItems.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center">
                No se encontraron registros
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

      <Modal show={!!selected} onHide={() => setSelected(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <BookingView
              reservation={selected}
              onClose={() => setSelected(null)}
            />
          )}
        </Modal.Body>
      </Modal>

      <Modal
        show={!!editing}
        onHide={() => {
          if (!saveLoading) setEditing(null);
        }}
        size="lg"
      >
        <Modal.Header closeButton={!saveLoading}>
          <Modal.Title>{isCreating ? "Nueva Reserva" : "Editar Reserva"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editing && (
            <BookingForm
              reservation={editing}
              users={users}
              screenings={screenings}
              isCreating={isCreating}
              saving={saveLoading}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
            />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default BookingList;
