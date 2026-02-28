import React, { useState, useEffect } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import type { Movie } from "./types";

interface MovieEditModalProps {
    show: boolean;
    onHide: () => void;
    movie: Movie | null;
    onSave: (m: Movie) => Promise<void>;
    loading: boolean;
}

export const MovieEditModal: React.FC<MovieEditModalProps> = ({
    show,
    onHide,
    movie,
    onSave,
    loading,
}) => {
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

    useEffect(() => {
        setEditingMovie(movie);
    }, [movie]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMovie) {
            await onSave(editingMovie);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>✏️ Editar Película</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {editingMovie && (
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="fw-bold">Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editingMovie.name}
                                        onChange={(e) =>
                                            setEditingMovie({
                                                ...editingMovie,
                                                name: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="fw-bold">Duración (min)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={editingMovie.length}
                                        onChange={(e) =>
                                            setEditingMovie({
                                                ...editingMovie,
                                                length: parseInt(e.target.value),
                                            })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="fw-bold">Género</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editingMovie.genre}
                                        onChange={(e) =>
                                            setEditingMovie({
                                                ...editingMovie,
                                                genre: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="fw-bold">Director</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editingMovie.director}
                                        onChange={(e) =>
                                            setEditingMovie({
                                                ...editingMovie,
                                                director: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="fw-bold">Categoría</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editingMovie.categorie}
                                        onChange={(e) =>
                                            setEditingMovie({
                                                ...editingMovie,
                                                categorie: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="fw-bold">Idioma</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editingMovie.lenguage}
                                        onChange={(e) =>
                                            setEditingMovie({
                                                ...editingMovie,
                                                lenguage: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editingMovie.description}
                                onChange={(e) =>
                                    setEditingMovie({
                                        ...editingMovie,
                                        description: e.target.value,
                                    })
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">URL del Poster</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingMovie.poster}
                                onChange={(e) =>
                                    setEditingMovie({
                                        ...editingMovie,
                                        poster: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Check
                                type="checkbox"
                                label="¿Incluir subtítulos?"
                                checked={editingMovie.subtitles}
                                onChange={(e) =>
                                    setEditingMovie({
                                        ...editingMovie,
                                        subtitles: e.target.checked,
                                    })
                                }
                            />
                        </Form.Group>

                        <div className="d-flex gap-2">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                                className="flex-grow-1"
                            >
                                {loading ? "⏳ Guardando..." : "✓ Guardar Cambios"}
                            </Button>
                            <Button variant="secondary" onClick={onHide}>
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};