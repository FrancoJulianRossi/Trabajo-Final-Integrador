import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Alert,
    Table,
    Modal,
    Pagination,
} from "react-bootstrap";

interface Movie {
    IdMovie?: number;
    Name: string;
    Length: number;
    Description: string;
    Genre: string;
    Categorie: string;
    Director: string;
    Lenguage: string;
    Subtitles: boolean;
    Poster: string;
}

export const AdminPanel: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [newMovie, setNewMovie] = useState<Movie>({
        Name: "",
        Length: 0,
        Description: "",
        Genre: "",
        Categorie: "",
        Director: "",
        Lenguage: "",
        Subtitles: false,
        Poster: "",
    });
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const API_BASE = "http://127.0.0.1:3000/api";

    // Búsqueda y filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Modal para ver detalles
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    // Modal para editar
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchMovies();
    }, []);

    // Aplicar filtros y búsqueda
    useEffect(() => {
        let filtered = movies;

        // Búsqueda por nombre
        if (searchTerm) {
            filtered = filtered.filter((m) =>
                m.Name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtro por género
        if (selectedGenre) {
            filtered = filtered.filter((m) =>
                m.Genre.toLowerCase().includes(selectedGenre.toLowerCase())
            );
        }

        // Filtro por categoría
        if (selectedCategory) {
            filtered = filtered.filter((m) => m.Categorie === selectedCategory);
        }

        // Filtro por idioma
        if (selectedLanguage) {
            filtered = filtered.filter((m) =>
                m.Lenguage.toLowerCase().includes(selectedLanguage.toLowerCase())
            );
        }

        setFilteredMovies(filtered);
        setCurrentPage(1);
    }, [movies, searchTerm, selectedGenre, selectedCategory, selectedLanguage]);

    const fetchMovies = async () => {
        try {
            const res = await fetch(`${API_BASE}/movies`);
            if (res.ok) {
                const data = await res.json();
                setMovies(data);
            }
        } catch (err: any) {
            setError("Error al cargar las películas");
        }
    };

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMovies = filteredMovies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

    const handleCreateMovie = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await fetch(`${API_BASE}/movies`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newMovie),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Error creating movie");
            }
            const created = await res.json();
            setMovies([...movies, created]);
            setNewMovie({
                Name: "",
                Length: 0,
                Description: "",
                Genre: "",
                Categorie: "",
                Director: "",
                Lenguage: "",
                Subtitles: false,
                Poster: "",
            });
            setSuccess("Película creada exitosamente ✓");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMovie = async (id: number) => {
        if (!window.confirm("¿Eliminar película?")) return;
        try {
            const res = await fetch(`${API_BASE}/movies/${id}`, {
                method: "DELETE",
                headers: {},
            });
            if (res.ok) {
                setMovies(movies.filter((m) => m.IdMovie !== id));
                setSuccess("Película eliminada exitosamente ✓");
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleUpdateMovie = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMovie?.IdMovie) return;

        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await fetch(`${API_BASE}/movies/${editingMovie.IdMovie}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editingMovie),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Error updating movie");
            }
            const updated = await res.json();
            setMovies(movies.map((m) => (m.IdMovie === updated.IdMovie ? updated : m)));
            setEditingMovie(null);
            setShowEditModal(false);
            setSuccess("Película actualizada exitosamente ✓");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleShowDetails = (movie: Movie) => {
        setSelectedMovie(movie);
        setShowDetailModal(true);
    };

    const handleShowEdit = (movie: Movie) => {
        setEditingMovie({ ...movie });
        setShowEditModal(true);
    };

    // Generar reporte
    const generateReport = (filtered: boolean = false) => {
        const dataToReport = filtered ? filteredMovies : movies;
        const headers = ["ID", "Nombre", "Duración", "Género", "Director", "Categoría", "Idioma"];
        const rows = dataToReport.map((m) => [
            m.IdMovie || "N/A",
            m.Name,
            `${m.Length} min`,
            m.Genre,
            m.Director,
            m.Categorie,
            m.Lenguage,
        ]);

        // Crear CSV
        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `reporte_peliculas_${filtered ? "filtrado" : "completo"}_${new Date().toISOString().split("T")[0]}.csv`
        );
        link.click();
    };

    const paginationItems = [];
    for (let page = 1; page <= totalPages; page++) {
        paginationItems.push(
            <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
            >
                {page}
            </Pagination.Item>
        );
    }

    const genres = [...new Set(movies.map((m) => m.Genre))];
    const categories = [...new Set(movies.map((m) => m.Categorie))];
    const languages = [...new Set(movies.map((m) => m.Lenguage))];

    return (
        <Container fluid className="movie-admin py-5">
            <h2 className="mb-4 fw-bold text-primary">
                ⚙️ Panel Admin - Gestión de Películas
            </h2>
            {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

            {/* Formulario de creación */}
            <Row className="mb-5 justify-content-center">
                <Col md={10}>
                    <Card className="shadow-lg border-0">
                        <Card.Header className="bg-primary text-white fw-bold">
                            🎬 Crear Nueva Película
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Form onSubmit={handleCreateMovie}>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="fw-bold">Nombre</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Título de la película"
                                                value={newMovie.Name}
                                                onChange={(e) =>
                                                    setNewMovie({ ...newMovie, Name: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="fw-bold">
                                                Duración (min)
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="120"
                                                value={newMovie.Length}
                                                onChange={(e) =>
                                                    setNewMovie({
                                                        ...newMovie,
                                                        Length: parseInt(e.target.value),
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
                                                value={newMovie.Genre}
                                                onChange={(e) =>
                                                    setNewMovie({ ...newMovie, Genre: e.target.value })
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
                                                value={newMovie.Director}
                                                onChange={(e) =>
                                                    setNewMovie({ ...newMovie, Director: e.target.value })
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
                                                value={newMovie.Categorie}
                                                onChange={(e) =>
                                                    setNewMovie({
                                                        ...newMovie,
                                                        Categorie: e.target.value,
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
                                                value={newMovie.Lenguage}
                                                onChange={(e) =>
                                                    setNewMovie({
                                                        ...newMovie,
                                                        Lenguage: e.target.value,
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
                                        value={newMovie.Description}
                                        onChange={(e) =>
                                            setNewMovie({
                                                ...newMovie,
                                                Description: e.target.value,
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
                                        value={newMovie.Poster}
                                        onChange={(e) =>
                                            setNewMovie({ ...newMovie, Poster: e.target.value })
                                        }
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Check
                                        type="checkbox"
                                        label="¿Incluir subtítulos?"
                                        checked={newMovie.Subtitles}
                                        onChange={(e) =>
                                            setNewMovie({
                                                ...newMovie,
                                                Subtitles: e.target.checked,
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
                </Col>
            </Row>

            {/* Búsqueda y Filtros */}
            <Row className="mb-4">
                <Col md={12}>
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
                                                setCurrentPage(1);
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
                </Col>
            </Row>

            {/* Listado de películas */}
            <Row className="mb-4">
                <Col md={12}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="fw-bold text-primary mb-0">
                            📽️ Películas Existentes ({filteredMovies.length})
                        </h3>
                        <div>
                            <Button
                                variant="success"
                                size="sm"
                                onClick={() => generateReport(false)}
                                className="me-2"
                            >
                                📄 Reporte Completo
                            </Button>
                            <Button
                                variant="warning"
                                size="sm"
                                onClick={() => generateReport(true)}
                            >
                                🔍 Reporte Filtrado
                            </Button>
                        </div>
                    </div>
                    {filteredMovies.length === 0 ? (
                        <Alert variant="info">No hay películas. ¡Crea una nueva!</Alert>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Duración</th>
                                            <th>Género</th>
                                            <th>Director</th>
                                            <th>Categoría</th>
                                            <th>Idioma</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentMovies.map((m) => (
                                            <tr key={m.IdMovie}>
                                                <td className="fw-bold">{m.Name}</td>
                                                <td>⏱️ {m.Length} min</td>
                                                <td>📂 {m.Genre}</td>
                                                <td>🎬 {m.Director}</td>
                                                <td>{m.Categorie}</td>
                                                <td>{m.Lenguage}</td>
                                                <td>
                                                    <Button
                                                        variant="info"
                                                        size="sm"
                                                        onClick={() => handleShowDetails(m)}
                                                        className="me-2"
                                                    >
                                                        👁️ Ver
                                                    </Button>
                                                    <Button
                                                        variant="warning"
                                                        size="sm"
                                                        onClick={() => handleShowEdit(m)}
                                                        className="me-2"
                                                    >
                                                        ✏️ Editar
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteMovie(m.IdMovie!)}
                                                    >
                                                        🗑️ Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>

                            {/* Paginación */}
                            <div className="d-flex justify-content-center mt-4">
                                <Pagination>{paginationItems}</Pagination>
                            </div>
                            <div className="text-center text-muted small mt-2">
                                Mostrando {indexOfFirstItem + 1} a{" "}
                                {Math.min(indexOfLastItem, filteredMovies.length)} de{" "}
                                {filteredMovies.length} películas
                            </div>
                        </>
                    )}
                </Col>
            </Row>

            {/* Modal de detalles */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>📽️ Detalles de la Película</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMovie && (
                        <div>
                            <p>
                                <strong>Nombre:</strong> {selectedMovie.Name}
                            </p>
                            <p>
                                <strong>Duración:</strong> {selectedMovie.Length} minutos
                            </p>
                            <p>
                                <strong>Género:</strong> {selectedMovie.Genre}
                            </p>
                            <p>
                                <strong>Director:</strong> {selectedMovie.Director}
                            </p>
                            <p>
                                <strong>Categoría:</strong> {selectedMovie.Categorie}
                            </p>
                            <p>
                                <strong>Idioma:</strong> {selectedMovie.Lenguage}
                            </p>
                            <p>
                                <strong>Subtítulos:</strong>{" "}
                                {selectedMovie.Subtitles ? "Sí ✓" : "No ✗"}
                            </p>
                            <p>
                                <strong>Descripción:</strong>
                            </p>
                            <p className="border-start ps-3">{selectedMovie.Description}</p>
                            {selectedMovie.Poster && (
                                <div>
                                    <strong>Poster:</strong>
                                    <div className="mt-2">
                                        <img
                                            src={selectedMovie.Poster}
                                            alt={selectedMovie.Name}
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
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de edición */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>✏️ Editar Película</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingMovie && (
                        <Form onSubmit={handleUpdateMovie}>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label className="fw-bold">Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editingMovie.Name}
                                            onChange={(e) =>
                                                setEditingMovie({
                                                    ...editingMovie,
                                                    Name: e.target.value,
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
                                            value={editingMovie.Length}
                                            onChange={(e) =>
                                                setEditingMovie({
                                                    ...editingMovie,
                                                    Length: parseInt(e.target.value),
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
                                            value={editingMovie.Genre}
                                            onChange={(e) =>
                                                setEditingMovie({
                                                    ...editingMovie,
                                                    Genre: e.target.value,
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
                                            value={editingMovie.Director}
                                            onChange={(e) =>
                                                setEditingMovie({
                                                    ...editingMovie,
                                                    Director: e.target.value,
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
                                            value={editingMovie.Categorie}
                                            onChange={(e) =>
                                                setEditingMovie({
                                                    ...editingMovie,
                                                    Categorie: e.target.value,
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
                                            value={editingMovie.Lenguage}
                                            onChange={(e) =>
                                                setEditingMovie({
                                                    ...editingMovie,
                                                    Lenguage: e.target.value,
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
                                    value={editingMovie.Description}
                                    onChange={(e) =>
                                        setEditingMovie({
                                            ...editingMovie,
                                            Description: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">URL del Poster</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editingMovie.Poster}
                                    onChange={(e) =>
                                        setEditingMovie({
                                            ...editingMovie,
                                            Poster: e.target.value,
                                        })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Check
                                    type="checkbox"
                                    label="¿Incluir subtítulos?"
                                    checked={editingMovie.Subtitles}
                                    onChange={(e) =>
                                        setEditingMovie({
                                            ...editingMovie,
                                            Subtitles: e.target.checked,
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
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setEditingMovie(null);
                                        setShowEditModal(false);
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};