import { useState } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import "./App.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginRegister } from "./components/LoginRegister";
import { Cartelera } from "./components/Cartelera";
import { SeleccionAsientos } from "./components/SeleccionAsientos";
import { ProcesoCompra } from "./components/ProcesoCompra";
import { Historial } from "./components/Historial";
import { AdminPanel } from "./components/AdminPanel";
import { AdminPanelScreenings } from "./components/AdminPanelScreenings";

interface Screening {
  idScreening: number;
  date: string;
  start: string;
  end: string;
  ticketPrice: number;
}

interface Movie {
  IdMovie: number;
  Name: string;
  Length: number;
  Description: string;
  Genre: string;
  Director: string;
  Poster: string;
}

interface Seat {
  id: number;
  row: number;
  column: number;
}

function AppContent() {
  const { user, logout } = useAuth();
  // considerar distintos formatos de role: string "admin" o boolean true
  const isAdmin = Boolean(
    user &&
      (String(user.role).toLowerCase() === "admin" || user.role === true)
  );
  const [screen, setScreen] = useState<
    "login" | "cartelera" | "asientos" | "compra" | "historial" | "adminpanelscreening" | "admin"
  >("login");
  const [selectedScreening, setSelectedScreening] = useState<Screening | null>(
    null
  );
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <LoginRegister onClose={() => setScreen("cartelera")} />
      </div>
    );
  }

  return (
    <div
      className="d-flex flex-column"
      style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <Navbar bg="dark" expand="lg" sticky="top" className="shadow-sm">
        <Container>
          <Navbar.Brand
            href="#"
            className="fw-bold"
            style={{ fontSize: "1.5rem", color: "#ffc107" }}
          >
            🎬 CineFlix
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto gap-3">
              <Nav.Link
                href="#"
                onClick={() => setScreen("cartelera")}
                className={screen === "cartelera" ? "text-warning fw-bold" : "text-white"}
              >
                Cartelera
              </Nav.Link>
              <Nav.Link
                href="#"
                onClick={() => setScreen("historial")}
                className={screen === "historial" ? "text-warning fw-bold" : "text-white"}
              >
                Mis Reservas
              </Nav.Link>

              {isAdmin && (
                <Nav.Link
                  href="#"
                  onClick={() => setScreen("adminpanelscreening")}
                  className={screen === "adminpanelscreening" ? "text-warning fw-bold" : "text-white"}
                >
                  Screenings
                </Nav.Link>
              )}
              
              {isAdmin && (
                <Nav.Link
                  href="#"
                  onClick={() => setScreen("admin")}
                  className={screen === "admin" ? "text-warning fw-bold" : "text-white"}
                >
                  Admin
                </Nav.Link>
              )}
            </Nav>
            <div className="ms-3 d-flex align-items-center gap-2">
              <span className="text-white fw-bold">{user.name}</span>
              <Button variant="outline-danger" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="flex-grow-1 py-4">
        {screen === "cartelera" && (
          <Cartelera
            onSelectScreening={(s, m) => {
              setSelectedScreening(s);
              setSelectedMovie(m);
              setSelectedSeats([]);
              setScreen("asientos");
            }}
          />
        )}

        {screen === "asientos" && selectedScreening && selectedMovie && (
          <SeleccionAsientos
            screening={selectedScreening}
            movie={selectedMovie}
            onConfirm={(seats) => {
              setSelectedSeats(seats);
              setScreen("compra");
            }}
            onBack={() => setScreen("cartelera")}
          />
        )}

        {screen === "compra" && selectedScreening && selectedMovie && (
          <ProcesoCompra
            screening={selectedScreening}
            movie={selectedMovie}
            seats={selectedSeats}
            onConfirm={() => {
              setScreen("historial");
            }}
            onBack={() => setScreen("asientos")}
          />
        )}

        {screen === "historial" && <Historial />}
        {screen === "admin" && isAdmin && <AdminPanel />}
        {screen === "adminpanelscreening" && isAdmin && <AdminPanelScreenings />}
      </Container>

      <footer className="bg-dark text-white text-center py-3 mt-4">
        <p className="mb-0">© 2025 CineFlix - Sistema de Gestión de Cine</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
