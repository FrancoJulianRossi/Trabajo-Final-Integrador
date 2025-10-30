import { rooms } from "../models/mocks/room.models";
import { Room } from "../models/mocks/entities/room.entity";

class RoomController {
    public getAllRooms(): Room[] {
        return rooms;
    }
    public getRoomById(id: string): Room | undefined {
        return rooms.find(room => room.getId() === id);
    }
}