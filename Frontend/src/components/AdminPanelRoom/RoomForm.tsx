import React, { useState, useEffect, useMemo } from "react";
import { Form, Button, Row, Col, Badge } from "react-bootstrap";
import type { Room, Seat } from "./types";

interface RoomFormProps {
  initialData?: Partial<Room>;
  onSave: (data: Partial<Room>) => void;
  onCancel: () => void;
  saving?: boolean;
}

const SEAT_TYPES = ["Standard", "VIP", "Disabled", "Empty"];

const SEAT_COLORS: Record<string, string> = {
  Standard: "#6c757d", // Gray
  VIP: "#ffc107",      // Gold
  Disabled: "#0dcaf0", // Cyan
  Empty: "#f8f9fa",    // Light (almost invisible)
};

export const RoomForm: React.FC<RoomFormProps> = ({
  initialData = {},
  onSave,
  onCancel,
  saving,
}) => {
  const [data, setData] = useState<Partial<Room>>({
    name: "",
    type: "",
    rows: 0,
    cols: 0,
    capacity: 0,
    seats: [],
    ...initialData,
  });

  const [localSeats, setLocalSeats] = useState<Seat[]>(initialData.seats || []);

  useEffect(() => {
    setData({
      name: "",
      type: "",
      rows: 0,
      cols: 0,
      capacity: 0,
      seats: [],
      ...initialData,
    });
    setLocalSeats(initialData.seats || []);
  }, [initialData]);

  // Generate grid if rows/cols change and we don't have seats yet
  useEffect(() => {
    if (data.rows && data.cols && localSeats.length === 0) {
      const newSeats: Seat[] = [];
      for (let r = 1; r <= data.rows; r++) {
        for (let c = 1; c <= data.cols; c++) {
          newSeats.push({
            row: r,
            column: c,
            type: "Standard",
          });
        }
      }
      setLocalSeats(newSeats);
    }
  }, [data.rows, data.cols]);

  const capacity = useMemo(() => {
    return localSeats.filter((s) => s.type !== "Empty").length;
  }, [localSeats]);

  const handleSeatClick = (row: number, col: number) => {
    setLocalSeats((prev) =>
      prev.map((s) => {
        if (s.row === row && s.column === col) {
          const currentIndex = SEAT_TYPES.indexOf(s.type);
          const nextIndex = (currentIndex + 1) % SEAT_TYPES.length;
          return { ...s, type: SEAT_TYPES[nextIndex] };
        }
        return s;
      })
    );
  };

  const handleDimensionChange = (field: "rows" | "cols", value: number) => {
    const newVal = Math.max(0, value);
    const updatedData = { ...data, [field]: newVal };
    setData(updatedData);

    // Re-generate or adjust seats
    const newRows = field === "rows" ? newVal : data.rows || 0;
    const newCols = field === "cols" ? newVal : data.cols || 0;

    const newSeats: Seat[] = [];
    for (let r = 1; r <= newRows; r++) {
      for (let c = 1; c <= newCols; c++) {
        const existing = localSeats.find((s) => s.row === r && s.column === c);
        newSeats.push(
          existing || {
            row: r,
            column: c,
            type: "Standard",
          }
        );
      }
    }
    setLocalSeats(newSeats);
  };

  const handleSubmit = () => {
    onSave({
      ...data,
      capacity,
      seats: localSeats,
    });
  };

  const renderGrid = () => {
    if (!data.rows || !data.cols) return null;

    const grid = [];
    for (let r = 1; r <= data.rows; r++) {
      const rowSeats = [];
      for (let c = 1; c <= data.cols; c++) {
        const seat = localSeats.find((s) => s.row === r && s.column === c);
        if (!seat) continue;

        rowSeats.push(
          <div
            key={`${r}-${c}`}
            onClick={() => handleSeatClick(r, c)}
            style={{
              width: "30px",
              height: "30px",
              margin: "2px",
              backgroundColor: SEAT_COLORS[seat.type],
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              color: seat.type === "Empty" ? "transparent" : "white",
            }}
            title={`Fila ${r}, Col ${c} - ${seat.type}`}
          >
            {String.fromCharCode(64 + r)}
            {c}
          </div>
        );
      }
      grid.push(
        <div key={r} className="d-flex justify-content-center">
          {rowSeats}
        </div>
      );
    }
    return (
      <div className="mt-4 p-3 border rounded bg-light" style={{ overflowX: "auto" }}>
        <h6 className="text-center mb-3">Mapa de Sala (Clic para cambiar tipo)</h6>
        <div className="mb-3 d-flex justify-content-center gap-3">
          {SEAT_TYPES.map(t => (
            <div key={t} className="d-flex align-items-center gap-1">
              <div style={{ width: 15, height: 15, backgroundColor: SEAT_COLORS[t], border: '1px solid #ccc' }}></div>
              <small>{t}</small>
            </div>
          ))}
        </div>
        <div className="d-flex flex-column align-items-center">
          <div className="mb-4 w-75 text-center p-1 bg-secondary text-white rounded">PANTALLA</div>
          {grid}
        </div>
      </div>
    );
  };

  return (
    <>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Nombre de la Sala</Form.Label>
              <Form.Control
                placeholder="Ej: Sala 1, IMAX..."
                value={data.name ?? ""}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Tipo de Proyección</Form.Label>
              <Form.Control
                placeholder="Ej: 2D, 3D, IMAX"
                value={data.type ?? ""}
                onChange={(e) => setData({ ...data, type: e.target.value })}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Filas</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={data.rows ?? 0}
                onChange={(e) => handleDimensionChange("rows", Number(e.target.value))}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Columnas</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={data.cols ?? 0}
                onChange={(e) => handleDimensionChange("cols", Number(e.target.value))}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Capacidad Total</Form.Label>
              <div className="h4 text-primary mt-1">
                <Badge bg="info">{capacity}</Badge>
              </div>
            </Form.Group>
          </Col>
        </Row>

        {renderGrid()}
      </Form>
      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving || !data.name || !data.rows || !data.cols}>
          {data.idRoom ? "Actualizar Sala" : "Crear Sala"}
        </Button>
      </div>
    </>
  );
};