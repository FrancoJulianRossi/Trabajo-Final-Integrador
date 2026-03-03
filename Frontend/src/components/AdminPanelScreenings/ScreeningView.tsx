import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import type { Screening, Movie } from "./types";

interface ScreeningViewProps {
  screening: Screening;
  movie?: Movie;
  onClose: () => void;
}

const ScreeningView: React.FC<ScreeningViewProps> = ({
  screening,
  movie,
  onClose,
}) => {
  return (
    <>
      <Row>
        <Col md={8}>
          <h5>Función #{screening.idScreening}</h5>
          <p>
            <strong>Película:</strong> {movie?.name ?? screening.movieId}
          </p>
          <p>
            <strong>Fecha:</strong> {screening.date}
          </p>
          <p>
            <strong>Inicio:</strong>{" "}
            {new Date(screening.start).toLocaleTimeString()}
          </p>
          <p>
            <strong>Fin:</strong>{" "}
            {screening.end ? new Date(screening.end).toLocaleTimeString() : "-"}
          </p>
          <p>
            <strong>Precio:</strong> ${screening.ticketPrice}
          </p>
        </Col>
        <Col md={4}>
          {movie?.poster && (
            <img
              src={movie.poster}
              alt="poster"
              style={{ maxWidth: "100%", borderRadius: 6 }}
            />
          )}
        </Col>
      </Row>
      <div className="text-end mt-3">
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </>
  );
};

export default ScreeningView;