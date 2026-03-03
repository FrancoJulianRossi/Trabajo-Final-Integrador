import React from "react";
import { Modal, Button, Row, Col, Badge } from "react-bootstrap";
import type { Room } from "./types";

interface RoomViewProps {
  room: Room;
  onClose: () => void;
}

const SEAT_COLORS: Record<string, string> = {
  Standard: "#6c757d",
  VIP: "#ffc107",
  Disabled: "#0dcaf0",
  Empty: "transparent",
};

export const RoomView: React.FC<RoomViewProps> = ({ room, onClose }) => {
  const renderGrid = () => {
    if (!room.rows || !room.cols || !room.seats) return <p>No hay mapa configurado para esta sala.</p>;

    const grid = [];
    for (let r = 1; r <= room.rows; r++) {
      const rowSeats = [];
      for (let c = 1; c <= room.cols; c++) {
        const seat = room.seats.find((s) => s.row === r && s.column === c);
        if (!seat) continue;

        rowSeats.push(
          <div
            key={`${r}-${c}`}
            style={{
              width: "25px",
              height: "25px",
              margin: "2px",
              backgroundColor: SEAT_COLORS[seat.type],
              border: seat.type === "Empty" ? "none" : "1px solid #ddd",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px",
              color: seat.type === "Empty" ? "transparent" : "white",
            }}
          >
            {String.fromCharCode(64 + r)}{c}
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
        <div className="d-flex flex-column align-items-center">
          <div className="mb-4 w-75 text-center p-1 bg-secondary text-white rounded" style={{ fontSize: '12px' }}>PANTALLA</div>
          {grid}
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal.Body>
        <Row>
          <Col md={12}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5>{room.name}</h5>
                <Badge bg="secondary" className="me-2">{room.type}</Badge>
                <Badge bg="info">Capacidad: {room.capacity}</Badge>
              </div>
              <div className="text-muted">
                <small>ID: {room.idRoom}</small>
              </div>
            </div>
            
            <p className="mb-1"><strong>Dimensiones:</strong> {room.rows} filas x {room.cols} columnas</p>
            
            <hr />
            
            {renderGrid()}
            
            <div className="mt-3 d-flex justify-content-center gap-3">
              {Object.entries(SEAT_COLORS).map(([type, color]) => (
                type !== 'Empty' && (
                  <div key={type} className="d-flex align-items-center gap-1">
                    <div style={{ width: 12, height: 12, backgroundColor: color, borderRadius: '2px' }}></div>
                    <small style={{ fontSize: '11px' }}>{type}</small>
                  </div>
                )
              ))}
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </>
  );
};