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
import BookingView from "./BookingView";
import BookingForm from "./BookingForm";

interface Seat {
  id: number;
  row: number;
  column: number;
}

interface Screening {
  idScreening: number;
  date: string;
  start: string;
  end: string;
  ticketPrice: number;
}

interface Reservation {
  id: number;
  screening: Screening;
  seats: Seat[];
  customerName?: string;
  createdAt?: string;
}

const API_BASE = "http://127.0.0.1:3000/api";

const BookingList: React.FC = () => {
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [editing, setEditing] = useState<Reservation | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        if (import.meta.env.VITE_STATIC_MOCKS) {
          const res = await fetch(`/mocks/bookings.json`);
          const data = await res.json();
          setItems(Array.isArray(data) ? data : []);
        } else {
          const res = await fetch(`${API_BASE}/bookings`);
          if (res.ok) {
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
          } else {
            setItems([]);
          }
        }
      } catch (err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const filtered = useMemo(() => {
    let out = items;
    if (query) {
      const q = query.toLowerCase();
      out = out.filter(
        (r) =>
          (r.customerName || "").toLowerCase().includes(q) ||
          String(r.id).includes(q)
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
  }, [totalPages]);

  const pageItems = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleDelete = async (id: number) => {
    // try backend DELETE, otherwise remove locally
    try {
      if (import.meta.env.VITE_STATIC_MOCKS) {
        setItems((s) => s.filter((i) => i.id !== id));
        return;
      }
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((s) => s.filter((i) => i.id !== id));
      } else {
        setItems((s) => s.filter((i) => i.id !== id));
      }
    } catch (err) {
      setItems((s) => s.filter((i) => i.id !== id));
    }
  };

  const handleSave = (updated: Reservation) => {
    const exists = items.find((i) => i.id === updated.id);
    if (exists) {
      setItems((s) => s.map((i) => (i.id === updated.id ? updated : i)));
    } else {
      setItems((s) => [updated, ...s]);
    }
    setEditing(null);
  };

  const exportCSV = (list: Reservation[]) => {
    const header = [
      "id",
      "customerName",
      "screeningDate",
      "start",
      "seats",
      "createdAt",
    ];
    const rows = list.map((r) => [
      r.id,
      r.customerName ?? "",
      r.screening?.date ?? "",
      r.screening?.start ?? "",
      (r.seats || []).map((s) => `${s.row}-${s.column}`).join("|") || "",
      r.createdAt || "",
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
                id: Date.now(),
                screening: {
                  idScreening: 0,
                  date: new Date().toISOString().split("T")[0],
                  start: "",
                  end: "",
                  ticketPrice: 0,
                },
                seats: [],
                customerName: "",
                createdAt: new Date().toISOString(),
              } as Reservation)
            }
          >
            Nueva
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Inicio</th>
            <th>Asientos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.customerName}</td>
              <td>{r.screening?.date}</td>
              <td>{r.screening?.start}</td>
              <td>
                {(r.seats || []).map((s) => `${s.row}-${s.column}`).join(", ")}
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
                  onClick={() => handleDelete(r.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {!loading && pageItems.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center">
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

      <Modal show={!!editing} onHide={() => setEditing(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editing?.id ? "Editar Reserva" : "Nueva Reserva"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editing && (
            <BookingForm
              reservation={editing}
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
