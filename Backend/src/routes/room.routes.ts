import { Router } from "express";
import { RoomController } from "../controllers/room.controller";
const router = Router();

const roomController = new RoomController();

router.get("/rooms", roomController.getAllRooms.bind(roomController));
router.get("/rooms/:id", roomController.getRoomById.bind(roomController));
router.get(
  "/rooms/:id/seats",
  roomController.getRoomSeats.bind(roomController),
);
router.post("/rooms", roomController.createRoom.bind(roomController));
router.put("/rooms/:id", roomController.updateRoom.bind(roomController));
router.delete("/rooms/:id", roomController.deleteRoom.bind(roomController));

export default router;