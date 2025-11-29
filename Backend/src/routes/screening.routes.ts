import { Router } from "express";
import { ScreeningController } from "../controllers/screening.controller";
const router = Router();

const screeningController = new ScreeningController();

router.get(
  "/screenings",
  screeningController.getAllScreenings.bind(screeningController)
);
router.get(
  "/screenings/:id",
  screeningController.getScreeningById.bind(screeningController)
);
router.get(
  "/screenings/:id/seats",
  screeningController.getSeatsForScreening.bind(screeningController)
);
router.post(
  "/screenings",
  screeningController.createScreening.bind(screeningController)
);
router.put(
  "/screenings/:id",
  screeningController.updateScreening.bind(screeningController)
);
router.delete(
  "/screenings/:id",
  screeningController.deleteScreening.bind(screeningController)
);

export default router;