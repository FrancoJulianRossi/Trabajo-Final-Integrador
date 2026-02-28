import React from "react";
import { Table, Button, Alert, Pagination } from "react-bootstrap";
import type { Movie } from "./types";

interface MovieListProps {
    movies: Movie[];
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onView: (movie: Movie) => void;
    onEdit: (movie: Movie) => void;
    onDelete: (id: number) => void;
    onGenerateReport: (filtered: boolean) => void;
    hasFilters: boolean;
}

export const MovieList: React.FC<MovieListProps> = ({
    movies,
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
    onView,
    onEdit,
    onDelete,
    onGenerateReport,
    hasFilters,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

    const paginationItems = [];
    for (let page = 1; page <= totalPages; page++) {
        paginationItems.push(
            <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => onPageChange(page)}
            >
                {page}
            </Pagination.Item>,
        );
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold text-primary mb-0">
                    📽️ Películas Existentes ({totalItems})
                </h3>
                <div>
                    <Button
                        variant="success"
                        size="sm"
                        onClick={() => onGenerateReport(false)}
                        className="me-2"
                    >
                        📄 Reporte Completo
                    </Button>
                    <Button
                        variant="warning"
                        size="sm"
                        onClick={() => onGenerateReport(true)}
                        disabled={!hasFilters}
                    >
                        🔍 Reporte Filtrado
                    </Button>
                </div>
            </div>
            {movies.length === 0 ? (
                <Alert variant="info">No hay películas para mostrar.</Alert>
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
                                {movies.map((m) => (
                                    <tr key={m.idMovie}>
                                        <td className="fw-bold">{m.name}</td>
                                        <td>⏱️ {m.length} min</td>
                                        <td>📂 {m.genre}</td>
                                        <td>🎬 {m.director}</td>
                                        <td>{m.categorie}</td>
                                        <td>{m.lenguage}</td>
                                        <td>
                                            <Button
                                                variant="info"
                                                size="sm"
                                                onClick={() => onView(m)}
                                                className="me-2"
                                            >
                                                👁️ Ver
                                            </Button>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() => onEdit(m)}
                                                className="me-2"
                                            >
                                                ✏️ Editar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => onDelete(m.idMovie!)}
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
                        {Math.min(indexOfFirstItem + itemsPerPage, totalItems)} de{" "}
                        {totalItems} películas
                    </div>
                </>
            )}
        </>
    );
};