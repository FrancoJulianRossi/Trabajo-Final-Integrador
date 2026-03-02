import express from "express";
import cors from "cors";
import movieRoutes from "./routes/movie.routes";
import authRoutes from "./routes/auth.routes";
import screeningRoutes from "./routes/screening.routes";
import userRoutes from "./routes/user.routes";
import bookingRoutes from "./routes/booking.routes";
import seedRoutes from "./routes/seed.routes";

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
app.use(express.json());

app.use("/api", movieRoutes);
app.use("/api", authRoutes);
app.use("/api", screeningRoutes);
app.use("/api", userRoutes);
app.use("/api", bookingRoutes);
app.use("/api", seedRoutes);

app.get("/", (req, res) => res.send("API Mock Server running"));

export default app;