"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const movie_routes_1 = __importDefault(require("./routes/movie.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const screening_routes_1 = __importDefault(require("./routes/screening.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const seed_routes_1 = __importDefault(require("./routes/seed.routes"));
const room_routes_1 = __importDefault(require("./routes/room.routes"));
const carousel_routes_1 = __importDefault(require("./routes/carousel.routes")); // Importar rutas del carrusel
const payment_routes_1 = __importDefault(require("./routes/payment.routes")); // Importar rutas de pagos
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // Necesario para Multer
// Servir archivos estáticos desde la carpeta 'uploads'
app.use("/uploads", express_1.default.static("uploads"));
app.use("/api", movie_routes_1.default);
app.use("/api", auth_routes_1.default);
app.use("/api", screening_routes_1.default);
app.use("/api", user_routes_1.default);
app.use("/api", booking_routes_1.default);
app.use("/api", seed_routes_1.default);
app.use("/api", room_routes_1.default);
app.use("/api", carousel_routes_1.default); // Usar rutas del carrusel
app.use("/api", payment_routes_1.default); // Usar rutas de pagos
app.get("/", (req, res) => res.send("API Mock Server running"));
exports.default = app;
//# sourceMappingURL=app.js.map