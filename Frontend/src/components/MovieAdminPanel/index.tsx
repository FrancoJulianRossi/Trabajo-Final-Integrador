import React, { useEffect, useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import type { Movie } from "./types";
import { MovieCreateForm } from "./MovieCreateForm";
import { MovieFilters } from "./MovieFilters";
import { MovieList } from "./MovieList";
import { MovieDetailModal } from "./MovieDetailModal";
import { MovieEditModal } from "./MovieEditModal";

const MovieAdminPanel: React.FC = () => {
    const { token } = useAuth();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    // newMovie state moved to MovieCreateForm
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000/api";
    const USE_STATIC = Boolean(import.meta.env.VITE_STATIC_MOCKS);

    const fetchMoviesFromApi = async () => {
        // Dynamic import to avoid static import issues if file doesn't exist yet,
        // though in this project structure it seems to exist.
        // Keeping original logic.
        const { getMovies } = await import("../../api/mockClient");
        return getMovies();
    };

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

        if (searchTerm) {
            filtered = filtered.filter((m) =>
                (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        if (selectedGenre) {
            filtered = filtered.filter((m) =>
                (m.genre || "").toLowerCase().includes(selectedGenre.toLowerCase()),
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter((m) => m.categorie === selectedCategory);
        }

        if (selectedLanguage) {
            filtered = filtered.filter((m) =>
                (m.lenguage || "")
                    .toLowerCase()
                    .includes(selectedLanguage.toLowerCase()),
            );
        }

        setFilteredMovies(filtered);
        setCurrentPage(1);
    }, [movies, searchTerm, selectedGenre, selectedCategory, selectedLanguage]);

    const fetchMovies = async () => {
        try {
            const data = await fetchMoviesFromApi();
            setMovies(data || []);
        } catch (err: any) {
            setError("Error al cargar las películas");
        }
    };

    const handleCreateMovie = async (movie: Movie) => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            if (USE_STATIC) {
                const created: Movie = { ...movie, idMovie: Date.now() };
                setMovies([...movies, created]);
                setSuccess("Película creada (modo mock) ✓");
                setTimeout(() => setSuccess(""), 3000);
            } else {
                const res = await fetch(`${API_BASE}/movies`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify(movie),
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message || "Error creating movie");
                }
                const created = await res.json();
                setMovies([...movies, created]);
                setSuccess("Película creada exitosamente ✓");
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMovie = async (id: number) => {
        if (!window.confirm("¿Eliminar película?")) return;
        try {
            if (USE_STATIC) {
                setMovies(movies.filter((m) => m.idMovie !== id));
                setSuccess("Película eliminada (modo mock) ✓");
                setTimeout(() => setSuccess(""), 3000);
                return;
            }
            const res = await fetch(`${API_BASE}/movies/${id}`, {
                method: "DELETE",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (res.ok) {
                setMovies(movies.filter((m) => m.idMovie !== id));
                setSuccess("Película eliminada exitosamente ✓");
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleUpdateMovie = async (movie: Movie) => {
        if (!movie.idMovie) return;

        setLoading(true);
        setError("");
        setSuccess("");
        try {
            if (USE_STATIC) {
                setMovies(movies.map((m) => (m.idMovie === movie.idMovie ? movie : m)));
                setEditingMovie(null);
                setShowEditModal(false);
                setSuccess("Película actualizada (modo mock) ✓");
                setTimeout(() => setSuccess(""), 3000);
            } else {
                const res = await fetch(`${API_BASE}/movies/${movie.idMovie}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify(movie),
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message || "Error updating movie");
                }
                const updated = await res.json();
                setMovies(
                    movies.map((m) => (m.idMovie === updated.idMovie ? updated : m)),
                );
                setEditingMovie(null);
                setShowEditModal(false);
                setSuccess("Película actualizada exitosamente ✓");
                setTimeout(() => setSuccess(""), 3000);
            }
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

    const generateReport = (filtered: boolean = false) => {
        const dataToReport = filtered ? filteredMovies : movies;
        const headers = [
            "ID",
            "Nombre",
            "Duración",
            "Género",
            "Director",
            "Categoría",
            "Idioma",
        ];
        const rows = dataToReport.map((m) => [
            m.idMovie || "N/A",
            m.name,
            `${m.length} min`,
            m.genre,
            m.director,
            m.categorie,
            m.lenguage,
        ]);

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
            `reporte_peliculas_${filtered ? "filtrado" : "completo"}_${new Date().toISOString().split("T")[0]
            }.csv`,
        );
        link.click();
    };

    // Paginación logic moved to MovieList (rendering) but slicing is done here?
    // Wait, I passed paginated movies to MovieList in my thought process?
    // "So MovieList should receive: movies: Movie[] (the slice)"
    // Yes.

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMovies = filteredMovies.slice(indexOfFirstItem, indexOfLastItem);

    const genres = [...new Set(movies.map((m) => m.genre))];
    const categories = [...new Set(movies.map((m) => m.categorie))];
    const languages = [...new Set(movies.map((m) => m.lenguage))];

    return (
        <Container fluid className="movie-admin py-5">
            <h2 className="mb-4 fw-bold text-primary">
                ⚙️ Panel Admin - Gestión de Películas
            </h2>
            {error && (
                <Alert variant="danger" onClose={() => setError("")} dismissible>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert variant="success" onClose={() => setSuccess("")} dismissible>
                    {success}
                </Alert>
            )}

            {/* Formulario de creación */}
            <Row className="mb-5 justify-content-center">
                <Col md={10}>
                    <MovieCreateForm onSubmit={handleCreateMovie} loading={loading} />
                </Col>
            </Row>

            {/* Búsqueda y Filtros */}
            <Row className="mb-4">
                <Col md={12}>
                    <MovieFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedGenre={selectedGenre}
                        setSelectedGenre={setSelectedGenre}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedLanguage={selectedLanguage}
                        setSelectedLanguage={setSelectedLanguage}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={(n) => {
                            setItemsPerPage(n);
                            setCurrentPage(1);
                        }}
                        genres={genres}
                        categories={categories}
                        languages={languages}
                    />
                </Col>
            </Row>

            {/* Listado de películas */}
            <Row className="mb-4">
                <Col md={12}>
                    <MovieList
                        movies={currentMovies}
                        totalItems={filteredMovies.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        onView={handleShowDetails}
                        onEdit={handleShowEdit}
                        onDelete={handleDeleteMovie}
                        onGenerateReport={generateReport}
                        hasFilters={filteredMovies.length !== movies.length} // primitive check
                    />
                </Col>
            </Row>

            {/* Modal de detalles */}
            <MovieDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                movie={selectedMovie}
            />

            {/* Modal de edición */}
            <MovieEditModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                movie={editingMovie}
                onSave={handleUpdateMovie}
                loading={loading}
            />
        </Container>
    );
};

export default MovieAdminPanel;