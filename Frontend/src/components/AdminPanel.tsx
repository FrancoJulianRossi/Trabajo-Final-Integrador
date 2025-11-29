import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import UserList from "./UserList";
import BookingList from "./BookingList";
import AdminPanelScreenings from "./AdminPanelScreenings";
import MovieAdminPanel from "./MovieAdminPanel";
import AdminPanelRoom from "./AdminPanelRoom";

export const AdminPanel: React.FC = () => {
  const [view, setView] = useState<
    "movies" | "screening" | "users" | "bookings" | "rooms"
  >("users");

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold text-primary">⚙️ Panel Admin</h2>
      <div className="mb-3">
        <Button
          variant={view === "movies" ? "primary" : "outline-primary"}
          className="me-2"
          onClick={() => setView("movies")}
        >
          Películas
        </Button>
        <Button
          variant={view === "screening" ? "primary" : "outline-primary"}
          className="me-2"
          onClick={() => setView("screening")}
        >
          Funciones
        </Button>
        <Button
          variant={view === "users" ? "primary" : "outline-primary"}
          className="me-2"
          onClick={() => setView("users")}
        >
          Usuarios
        </Button>
        <Button
          variant={view === "bookings" ? "primary" : "outline-primary"}
          className="me-2"
          onClick={() => setView("bookings")}
        >
          Reservas
        </Button>
        <Button
          variant={view === "rooms" ? "primary" : "outline-primary"}
          className="me-2"
          onClick={() => setView("rooms")}
        >
          Salas
        </Button>
      </div>

      {view === "movies" && <MovieAdminPanel />}
      {view === "screening" && <AdminPanelScreenings />}
      {view === "users" && <UserList />}
      {view === "bookings" && <BookingList />}
      {view === "rooms" && <AdminPanelRoom />}
    </Container>
  );
};
