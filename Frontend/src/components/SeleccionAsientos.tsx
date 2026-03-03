import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { getSeats, getRoomSeats } from "../api/mockClient";
import type { Seat } from "./components/AdminPanelRoom/types"; // Re-using the central type

interface Screening {
  idScreening: number;
  date: string;
  start: string;
  end: string;
  ticketPrice: number;
  roomId?: number;
}

interface Movie {
  idMovie?: number;
  name?: string;
  IdMovie?: number;
  Name?: string;
  length?: number;
  Length?: number;
}

const SEAT_COLORS: Record<string, string> = {
  Standard: "#6c757d",
  VIP: "#ffc107",
  Disabled: "#0dcaf0",
  Empty: "transparent",
  Selected: "#28a745", // Green for selected
  Occupied: "#343a40", // Dark gray for occupied
};

export const SeleccionAsientos: React.FC<{
  screening: Screening;
  movie: Movie;
  onConfirm: (seats: Seat[]) => void;
  onBack: () => void;
}> = ({ screening, movie, onConfirm, onBack }) => {
  const [occupied, setOccupied] = useState<{ row: number; column: number }[]>([]);
  const [allSeats, setAllSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const occupiedData = await getSeats(screening.idScreening);
        setOccupied(occupiedData?.occupied || []);

        if (screening.roomId) {
          const seatsData = await getRoomSeats(screening.roomId);
          setAllSeats(seatsData || []);
        }
      } catch (error) {
        console.error("Error loading seats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [screening]);

  const movieName = movie.name || movie.Name || "Película";
  const maxCol = Math.max(...allSeats.map((s) => s.column), 0);
  const maxRow = Math.max(...allSeats.map((s) => s.row), 0);
  
  const getSeatState = (seat: Seat) => {
    if (occupied.some(o => o.row === seat.row && o.column === seat.column)) return "Occupied";
    if (selected.some(s => s.idSeat === seat.idSeat)) return "Selected";
    return seat.type;
  };

  const toggle_seat = (seat: Seat) => {
    if (seat.type === "Empty" || getSeatState(seat) === "Occupied") return;
    
    if (selected.some(s => s.idSeat === seat.idSeat)) {
      setSelected(selected.filter((s) => s.idSeat !== seat.idSeat));
    } else {
      setSelected([...selected, seat]);
    }
  };

  const total = selected.length * screening.ticketPrice;

  const renderGrid = () => {
    const grid = [];
    for (let r = 1; r <= maxRow; r++) {
      const rowSeats = [];
      for (let c = 1; c <= maxCol; c++) {
        const seat = allSeats.find(s => s.row === r && s.column === c);
        
        if (!seat) {
           rowSeats.push(<div key={`empty-${r}-${c}`} style={{ width: "35px", height: "35px", margin: "3px" }} />);
           continue;
        }

        const state = getSeatState(seat);
        const isActionable = seat.type !== 'Empty' && state !== 'Occupied';
        
        rowSeats.push(
          <div
            key={seat.idSeat}
            onClick={() => toggle_seat(seat)}
            style={{
              width: "35px",
              height: "35px",
              margin: "3px",
              backgroundColor: SEAT_COLORS[state],
              border: state === "Empty" ? "none" : `1px solid #555`,
              borderRadius: "5px",
              cursor: isActionable ? "pointer" : "not-allowed",
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              opacity: state === 'Occupied' ? 0.6 : 1,
            }}
          >
             {seat.type !== 'Empty' ? `${String.fromCharCode(64 + r)}${c}`: ''}
          </div>
        );
      }
      grid.push(<div key={r} className="d-flex justify-content-center">{rowSeats}</div>);
    }
    return grid;
  }

  if (loading) {
    return <Container className="py-5 text-center">Cargando asientos...</Container>;
  }

  if (allSeats.length === 0) {
    return (
      <Container className="py-5">
        <p className="text-center text-danger">No hay mapa de asientos para esta sala.</p>
        <Button variant="outline-secondary" onClick={onBack}>← Volver</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Button variant="outline-secondary" onClick={onBack} className="mb-4">← Volver</Button>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h2 className="fw-bold text-primary mb-2">{movieName}</h2>
          <p className="text-muted">
            🕐 {new Date(screening.start).toLocaleTimeString()} | 💰 ${screening.ticketPrice} por asiento
          </p>

          <div className="mt-4 mb-4 p-3 border rounded bg-light">
             <div className="mb-4 w-75 mx-auto text-center p-1 bg-dark text-white rounded">PANTALLA</div>
             {renderGrid()}
          </div>
          
          <div className="d-flex justify-content-center flex-wrap gap-3 mb-4">
             {Object.entries(SEAT_COLORS).map(([type, color]) => (
                type !== 'Empty' && (
                  <div key={type} className="d-flex align-items-center gap-1">
                    <div style={{ width: 15, height: 15, backgroundColor: color, borderRadius: '3px', border: '1px solid #555' }}></div>
                    <small>{type}</small>
                  </div>
                )
             ))}
          </div>

          <div className="bg-light p-4 rounded mb-4 border">
            <h4 className="fw-bold text-primary mb-3">🎟️ Asientos Seleccionados: {selected.length}</h4>
            {selected.length > 0 ? (
              <div>
                {selected.map((s) => (
                  <Badge key={s.idSeat} bg="primary" className="me-2 mb-2 fs-6">
                    {String.fromCharCode(64 + s.row)}{s.column}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted">Selecciona asientos para continuar</p>
            )}
          </div>

          <div className="bg-primary text-white p-4 rounded mb-4">
            <h3 className="fw-bold">Total: ${total}</h3>
          </div>

          <Button
            variant="success"
            onClick={() => onConfirm(selected)}
            disabled={selected.length === 0}
            className="w-100 py-3 fw-bold"
          >
            ✓ Confirmar Reserva
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
