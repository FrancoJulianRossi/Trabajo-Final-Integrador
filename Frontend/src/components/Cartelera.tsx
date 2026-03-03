import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { getMovies, getScreenings, getBanners } from "../api/mockClient";
import { useParams, useNavigate } from "react-router-dom";
import HeroCarousel from "./HeroCarousel";
import type { IHeroCarouselItem } from "./HeroCarousel";

interface Movie {
  idMovie: number;
  name: string;
  description: string;
  length: number;
  genre: string;
  categorie: string;
  director: string;
  lenguage: string;
  subtitles: boolean;
  poster: string;
}

interface Screening {
  idScreening: number;
  date: string;
  start: string;
  end: string;
  ticketPrice: number;
  movieId: number;
}

interface ICarouselBanner {
  id: number;
  title: string;
  subtitle: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  link: string;
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Función auxiliar para formatear los días (ej: "Hoy", "Mañana", "Lunes 15/03")
const getDayLabel = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Hoy";
  if (date.toDateString() === tomorrow.toDateString()) return "Mañana";

  const formatter = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const weekday = parts.find((p) => p.type === "weekday")?.value || "";
  const day = parts.find((p) => p.type === "day")?.value || "";
  const month = parts.find((p) => p.type === "month")?.value || "";

  // Retorna el día con la primera letra mayúscula (ej: "Miércoles 12/04")
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} ${day}/${month}`;
};

export const Cartelera: React.FC<{
  onSelectScreening: (screening: Screening, movie: Movie) => void;
}> = ({ onSelectScreening }) => {
  const { idMovie } = useParams<{ idMovie?: string }>();
  const navigate = useNavigate();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [allScreenings, setAllScreenings] = useState<Screening[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [filter, setFilter] = useState("");
  const [carouselBanners, setCarouselBanners] = useState<ICarouselBanner[]>([]);

  // Nuevo estado para la fecha seleccionada en la vista de detalle
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const moviesData = await getMovies();
      const screeningsData = await getScreenings();
      setMovies(moviesData || []);
      setAllScreenings(screeningsData || []);
      if (idMovie) {
        const movieFromUrl = moviesData.find(
          (m: Movie) => m.idMovie === Number(idMovie),
        );
        setSelectedMovie(movieFromUrl || null);
      } else {
        // si no hay id en la URL, aseguramos dejar la vista en el listado
        setSelectedMovie(null);
      }

      const bannersData = await getBanners();
      setCarouselBanners(bannersData || []);
    };
    fetchData();
  }, [idMovie]);

  useEffect(() => {
    if (selectedMovie) {
      const fetchScreenings = async () => {
        const data = await getScreenings(selectedMovie.idMovie);
        setScreenings(data || []);
        // Si hay funciones, seleccionamos el primer día disponible por defecto
        if (data && data.length > 0) {
          setSelectedDate(getDayLabel(data[0].start));
        }
      };
      fetchScreenings();
    } else {
      setScreenings([]);
      setSelectedDate(null);
    }
  }, [selectedMovie]);

  const moviesWithScreenings = movies.filter((m) =>
    allScreenings.some((s) => s.movieId === m.idMovie),
  );

  const filtered = moviesWithScreenings.filter(
    (m) => !filter || m.genre.toLowerCase().includes(filter.toLowerCase()),
  );

  const handleMovieClick = (movie: Movie) => {
    navigate(`/cartelera/${movie.idMovie}`);
  };

  const handleBackToCartelera = () => {
    // limpiar estado seleccionado antes de navegar para asegurarnos de
    // renderizar la vista de lista al regresar
    setSelectedMovie(null);
    navigate("/cartelera");
  };

  const activeCarouselItems: IHeroCarouselItem[] = carouselBanners
    .filter((banner) => banner.isActive)
    .sort((a, b) => a.order - b.order)
    .map((banner) => ({
      id: banner.id.toString(),
      title: banner.title,
      subtitle: banner.subtitle || "",
      backgroundImage: banner.desktopImageUrl,
      trailerLink: banner.link || "#",
      infoLink: banner.link || "#",
    }));

  // Obtener fechas únicas para las pestañas en la vista de detalle
  const uniqueDatesDetail = Array.from(
    new Set(screenings.map((s) => getDayLabel(s.start))),
  );

  // Filtrar los horarios de la película según el día seleccionado
  const screeningsForSelectedDate = screenings.filter(
    (s) => getDayLabel(s.start) === selectedDate,
  );

  return (
    <>
      {/* sólo mostramos el carrusel en la vista general de cartelera */}
      {!selectedMovie && <HeroCarousel items={activeCarouselItems} />}

      <Container className="py-5">
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
            {filtered.map((m) => {
              const movieScreenings = allScreenings.filter(
                (s) => s.movieId === m.idMovie,
              );
              // Obtener los días únicos para mostrar en la tarjeta general
              const uniqueDaysCard = Array.from(
                new Set(movieScreenings.map((s) => getDayLabel(s.start))),
              );

              return (
                <Col md={4} sm={6} xs={12} key={m.idMovie} className="mb-4">
                  <Card
                    className="h-100 shadow-sm border-0"
                    onClick={() => handleMovieClick(m)}
                    style={{
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-5px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "none")
                    }
                  >
                    <Card.Body>
                      <Card.Img
                        variant="top"
                        style={{
                          width: "100%",
                          height: "300px",
                          objectFit: "cover",
                        }}
                        src={m.poster}
                        alt={m.name}
                        className="mb-3 rounded"
                      />
                      <Card.Title className="fw-bold text-truncate">
                        {m.name}
                      </Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        📂 {m.genre}
                      </Card.Subtitle>
                      <p className="text-secondary mb-1">
                        <small>⏱️ {m.length} min</small>
                      </p>
                      <p
                        className="text-secondary mb-2"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        <small>{m.description}</small>
                      </p>
                      <hr />
                      <div>
                        <p className="fw-bold text-primary mb-2">
                          Días disponibles:
                        </p>
                        <div className="d-flex flex-wrap gap-2">
                          {/* Muestra los días en lugar de todos los horarios de golpe */}
                          {uniqueDaysCard.map((day) => (
                            <span
                              key={day}
                              className="badge bg-secondary text-white"
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <div className="animate__animated animate__fadeIn">
            <Button
              variant="outline-secondary"
              onClick={handleBackToCartelera}
              className="mb-4"
            >
              ← Volver a Cartelera
            </Button>
            <Row className="justify-content-center">
              <Col md={8}>
                <h2 className="fw-bold text-primary mb-3">
                  {selectedMovie.name}
                </h2>
                <p className="lead text-muted">{selectedMovie.description}</p>
                <p>
                  <strong>Director:</strong> {selectedMovie.director}
                </p>
                <p>
                  <strong>Duración:</strong> {selectedMovie.length} minutos
                </p>
              </Col>
            </Row>

            <Row className="mt-5 justify-content-center">
              <Col>
                <h3 className="fw-bold text-primary mb-4 text-center">
                  🕐 Horarios Disponibles
                </h3>

                {/* Pestañas de días (estilo similar a la imagen) */}
                <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
                  {uniqueDatesDetail.map((date) => (
                    <Button
                      key={date}
                      variant={
                        selectedDate === date ? "primary" : "outline-secondary"
                      }
                      className="px-4 py-2 fw-bold"
                      onClick={() => setSelectedDate(date)}
                    >
                      {date}
                    </Button>
                  ))}
                </div>

                {/* Tarjeta simulando la separación del cine y formato */}
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-dark text-white fw-bold fs-5">
                    Funciones
                  </Card.Header>
                  <Card.Body className="bg-light">
                    <p className="fw-bold text-muted mb-3 border-bottom pb-2">
                      {selectedMovie.lenguage.toUpperCase()} ·{" "}
                      {selectedMovie.subtitles ? "SUBTITULADO" : "DOBLADO"}
                    </p>
                    <Row className="justify-content-start">
                      {/* Horarios filtrados por el día seleccionado */}
                      {screeningsForSelectedDate.length > 0 ? (
                        screeningsForSelectedDate.map((s) => (
                          <Col
                            md={3}
                            sm={4}
                            xs={6}
                            key={s.idScreening}
                            className="mb-3"
                          >
                            <Button
                              variant="success" // Botón verde como en la imagen
                              className="w-100 py-2 fw-bold shadow-sm"
                              onClick={() =>
                                onSelectScreening(s, selectedMovie)
                              }
                              style={{
                                backgroundColor: "#48c774",
                                borderColor: "#48c774",
                              }}
                            >
                              <div className="fs-5">
                                {new Date(s.start).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </Button>
                          </Col>
                        ))
                      ) : (
                        <p className="text-center text-muted w-100 mt-3">
                          No hay horarios para este día.
                        </p>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </>
  );
};
