// src/routes/carousel.routes.ts

import { Router } from "express";
import * as carouselController from "../controllers/carousel.controller";
import { upload } from "../config/multer";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";
import { validateCarouselItem } from "../middleware/validation.middleware";

const router = Router();

// --- Rutas Públicas ---
router.get("/public", carouselController.getPublicItems);

// --- Rutas de Administración (Protegidas) ---
const adminRouter = Router();

// Obtener todos los items (con acceso admin)
adminRouter.get(
  "/",
  [authenticate, requireAdmin],
  carouselController.getAllItems,
);

// Crear nuevo item
adminRouter.post(
  "/",
  [authenticate, requireAdmin, upload, validateCarouselItem],
  carouselController.createItem,
);

// Actualizar item existente
adminRouter.put(
  "/:id",
  [authenticate, requireAdmin, upload, validateCarouselItem],
  carouselController.updateItem,
);

// Eliminar item
adminRouter.delete(
  "/:id",
  [authenticate, requireAdmin],
  carouselController.deleteItem,
);

// Combinamos las rutas públicas y de admin bajo prefijos
const mainRouter = Router();
mainRouter.use("/carousel", router);
mainRouter.use("/admin/carousel", adminRouter);

export default mainRouter;
