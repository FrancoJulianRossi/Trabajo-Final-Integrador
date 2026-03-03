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

adminRouter.get(
  "/",
  [authenticate, requireAdmin],
  carouselController.getAllItems,
);

adminRouter.post(
  "/",
  [authenticate, requireAdmin, upload, validateCarouselItem],
  carouselController.createItem,
);

adminRouter.put(
  "/:id",
  [authenticate, requireAdmin, upload, validateCarouselItem],
  carouselController.updateItem,
);

adminRouter.delete(
  "/:id",
  [authenticate, requireAdmin],
  carouselController.deleteItem,
);

const mainRouter = Router();
mainRouter.use("/carousel", router);
mainRouter.use("/admin/carousel", adminRouter);

export default mainRouter;
