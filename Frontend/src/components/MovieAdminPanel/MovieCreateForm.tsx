import React, { useState, useEffect } from "react";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import type { Movie } from "./types";

interface MovieCreateFormProps {
    onSubmit: (movie: Movie) => Promise<void>;
    loading: boolean;
}

export const MovieCreateForm: React.FC<MovieCreateFormProps> = ({
    onSubmit,
    loading,
}) => {
    const initialMovie: Movie = {
        name: "",
        length: 0,
        description: "",
        genre: "",
        categorie: "",
        director: "",
        lenguage: "",
        subtitles: false,
        poster: "",
    };
    const [newMovie, setNewMovie] = useState<Movie>(initialMovie);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(newMovie);
        setNewMovie(initialMovie);
    };

    return (
        <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white fw-bold">
                🎬 Crear Nueva Película
            </Card.Header>
            <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label className="fw-bold">Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Título de la película"
                                    value={newMovie.name}
                                    onChange={(e) =>
                                        setNewMovie({ ...newMovie, name: e.target.value })
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
                                    placeholder="120"
                                    value={newMovie.length}
                                    onChange={(e) =>
                                        setNewMovie({
                                            ...newMovie,
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
                                    placeholder="Ej: Acción, Drama"
                                    value={newMovie.genre}
                                    onChange={(e) =>
                                        setNewMovie({ ...newMovie, genre: e.target.value })
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
                                    placeholder="Nombre del director"
                                    value={newMovie.director}
                                    onChange={(e) =>
                                        setNewMovie({ ...newMovie, director: e.target.value })
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
                                    placeholder="Ej: PG, PG-13, R"
                                    value={newMovie.categorie}
                                    onChange={(e) =>
                                        setNewMovie({
                                            ...newMovie,
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
                                    placeholder="Ej: Español, Inglés"
                                    value={newMovie.lenguage}
                                    onChange={(e) =>
                                        setNewMovie({
                                            ...newMovie,
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
                            placeholder="Sinopsis de la película"
                            value={newMovie.description}
                            onChange={(e) =>
                                setNewMovie({
                                    ...newMovie,
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
                            placeholder="https://..."
                            value={newMovie.poster}
                            onChange={(e) =>
                                setNewMovie({ ...newMovie, poster: e.target.value })
                            }
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Check
                            type="checkbox"
                            label="¿Incluir subtítulos?"
                            checked={newMovie.subtitles}
                            onChange={(e) =>
                                setNewMovie({
                                    ...newMovie,
                                    subtitles: e.target.checked,
                                })
                            }
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                        className="w-100 py-2 fw-bold"
                    >
                        {loading ? "⏳ Creando..." : "✓ Crear Película"}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};