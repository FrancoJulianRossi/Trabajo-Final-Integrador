import React from "react";
import { Card, Form, Row, Col } from "react-bootstrap";

interface MovieFiltersProps {
    searchTerm: string;
    setSearchTerm: (s: string) => void;
    selectedGenre: string;
    setSelectedGenre: (s: string) => void;
    selectedCategory: string;
    setSelectedCategory: (s: string) => void;
    selectedLanguage: string;
    setSelectedLanguage: (s: string) => void;
    itemsPerPage: number;
    setItemsPerPage: (n: number) => void;
    genres: string[];
    categories: string[];
    languages: string[];
}

export const MovieFilters: React.FC<MovieFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    selectedGenre,
    setSelectedGenre,
    selectedCategory,
    setSelectedCategory,
    selectedLanguage,
    setSelectedLanguage,
    itemsPerPage,
    setItemsPerPage,
    genres,
    categories,
    languages,
}) => {
    return (
        <Card className="shadow-lg border-0">
            <Card.Header className="bg-info text-white fw-bold">
                🔍 Búsqueda y Filtros
            </Card.Header>
            <Card.Body className="p-4">
                <Row>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label className="fw-bold">Buscar por nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el nombre de la película..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label className="fw-bold">Filtrar por género</Form.Label>
                            <Form.Select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                            >
                                <option value="">Todos los géneros</option>
                                {genres.map((genre) => (
                                    <option key={genre} value={genre}>
                                        {genre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} className="mb-3">
                        <Form.Group>
                            <Form.Label className="fw-bold">Filtrar por categoría</Form.Label>
                            <Form.Select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Form.Group>
                            <Form.Label className="fw-bold">Filtrar por idioma</Form.Label>
                            <Form.Select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                            >
                                <option value="">Todos los idiomas</option>
                                {languages.map((lang) => (
                                    <option key={lang} value={lang}>
                                        {lang}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Form.Group>
                            <Form.Label className="fw-bold">Elementos por página</Form.Label>
                            <Form.Select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(parseInt(e.target.value));
                                }}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};