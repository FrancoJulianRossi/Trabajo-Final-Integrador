import express from "express";
import cors from "cors";
import movieRoutes from "./routes/movie.routes";
import authRoutes from "./routes/auth.routes";
import screeningRoutes from "./routes/screening.routes";
import userRoutes from "./routes/user.routes";
import bookingRoutes from "./routes/booking.routes";
import seedRoutes from "./routes/seed.routes";
import roomRoutes from "./routes/room.routes";
import carouselRoutes from "./routes/carousel.routes"; // Importar rutas del carrusel
import paymentRoutes from "./routes/payment.routes"; // Importar rutas de pagos

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Necesario para Multer

// Servir archivos estáticos desde la carpeta 'uploads'
app.use("/uploads", express.static("uploads"));

app.use("/api", movieRoutes);
app.use("/api", authRoutes);
app.use("/api", screeningRoutes);
app.use("/api", userRoutes);
app.use("/api", bookingRoutes);
app.use("/api", seedRoutes);
app.use("/api", roomRoutes);
app.use("/api", carouselRoutes); // Usar rutas del carrusel
app.use("/api", paymentRoutes); // Usar rutas de pagos

app.get("/", (req, res) => res.send("API Mock Server running"));

export default app;
