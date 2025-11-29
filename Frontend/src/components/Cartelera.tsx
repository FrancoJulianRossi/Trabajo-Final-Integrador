import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

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
  date: string;
  start: string;
  end: string;
  ticketPrice: number;
}

export const Cartelera: React.FC<{
  onSelectScreening: (screening: Screening, movie: Movie) => void;
}> = ({ onSelectScreening }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [filter, setFilter] = useState("");

  const API_BASE = "http://127.0.0.1:3000/api";

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch(`${API_BASE}/movies`);
      if (res.ok) {
        const data = await res.json();
        setMovies(data);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (selectedMovie) {
      const fetchScreenings = async () => {
        const res = await fetch(`${API_BASE}/screenings`);
        if (res.ok) {
          const data = await res.json();
          setScreenings(data);
        }
      };
      fetchScreenings();
    }
  }, [selectedMovie]);

  const filtered = movies.filter(
    (m) => !filter || m.Genre.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Container className="py-5 ">
      <h1 className="mb-4 fw-bold text-primary">🎬 Cartelera</h1>
      <Row className="mb-4 justify-content-center">
        <Col md={4}>
          <Form.Group>
            <Form.Label className="fw-bold">Filtrar por género</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa un género..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {!selectedMovie ? (
        <Row className="justify-content-center">
          {filtered.map((m) => (
            <Col md={4} sm={6} xs={12} key={m.IdMovie} className="mb-4">
              <Card
                className="h-100 shadow-sm border-0 cursor-pointer"
                onClick={() => setSelectedMovie(m)}
                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                <Card.Body>
                  <Card.Title className="fw-bold text-truncate">
                    {m.Name}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    📂 {m.Genre}
                  </Card.Subtitle>
                  <p className="text-secondary">
                    <small>⏱️ {m.Length} min</small>
                  </p>
                  <p className="text-secondary">
                    <small>{m.Description}</small>
                  </p>
                  <p className="text-muted">
                    <small>Dirección: {m.Director}</small>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div>
          <Button
            variant="outline-secondary"
            onClick={() => setSelectedMovie(null)}
            className="mb-4"
          >
            ← Volver a Cartelera
          </Button>
          <Row className="justify-content-center">
            <Col md={8}>
              <h2 className="fw-bold text-primary mb-3">
                {selectedMovie.Name}
              </h2>
              <p className="lead text-muted">{selectedMovie.Description}</p>
              <p>
                <strong>Director:</strong> {selectedMovie.Director}
              </p>
              <p>
                <strong>Duración:</strong> {selectedMovie.Length} minutos
              </p>
            </Col>
          </Row>

          <Row className="mt-5 justify-content-center">
            <Col>
              <h3 className="fw-bold text-primary mb-4">
                🕐 Horarios Disponibles
              </h3>
              <Row className="justify-content-center">
                {screenings.map((s) => (
                  <Col
                    md={3}
                    sm={6}
                    xs={12}
                    key={s.idScreening}
                    className="mb-3"
                  >
                    <Button
                      variant="primary"
                      className="w-100 py-3 fw-bold"
                      onClick={() => onSelectScreening(s, selectedMovie)}
                    >
                      <div>{new Date(s.start).toLocaleTimeString()}</div>
                      <small>💰 ${s.ticketPrice}</small>
                    </Button>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
};