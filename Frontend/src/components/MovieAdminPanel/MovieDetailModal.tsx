import React from "react";
import { Modal, Button } from "react-bootstrap";
import type { Movie } from "./types";

interface MovieDetailModalProps {
    show: boolean;
    onHide: () => void;
    movie: Movie | null;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
    show,
    onHide,
    movie,
}) => {
    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>📽️ Detalles de la Película</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {movie && (
                    <div>
                        <p>
                            <strong>Nombre:</strong> {movie.name}
                        </p>
                        <p>
                            <strong>Duración:</strong> {movie.length} minutos
                        </p>
                        <p>
                            <strong>Género:</strong> {movie.genre}
                        </p>
                        <p>
                            <strong>Director:</strong> {movie.director}
                        </p>
                        <p>
                            <strong>Categoría:</strong> {movie.categorie}
                        </p>
                        <p>
                            <strong>Idioma:</strong> {movie.lenguage}
                        </p>
                        <p>
                            <strong>Subtítulos:</strong> {movie.subtitles ? "Sí ✓" : "No ✗"}
                        </p>
                        <p>
                            <strong>Descripción:</strong>
                        </p>
                        <p className="border-start ps-3">{movie.description}</p>
                        {movie.poster && (
                            <div>
                                <strong>Poster:</strong>
                                <div className="mt-2">
                                    <img
                                        src={movie.poster}
                                        alt={movie.name}
                                        className="img-fluid"
                                        style={{ maxHeight: "300px" }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};