import { Router } from "express";
import MoviesController from "../controllers/movie.controller";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/movies", MoviesController.list.bind(MoviesController));
router.get("/movies/:id", MoviesController.getById.bind(MoviesController));
router.post(
    "/movies",
    authenticate,
    requireAdmin,
    MoviesController.create.bind(MoviesController)
);
router.put(
    "/movies/:id",
    authenticate,
    requireAdmin,
    MoviesController.update.bind(MoviesController)
);
router.delete(
    "/movies/:id",
    authenticate,
    requireAdmin,
    MoviesController.delete.bind(MoviesController)
);

export default router;