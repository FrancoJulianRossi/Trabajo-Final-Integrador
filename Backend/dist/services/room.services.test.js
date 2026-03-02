"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const room_services_1 = require("./room.services");
const room_model_1 = require("../models/room.model");
const screening_model_1 = require("../models/screening.model");
jest.mock('../models/room.model');
jest.mock('../models/screening.model');
const roomService = new room_services_1.RoomService();
describe('RoomService', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('deleteRoom returns false if room not found', async () => {
        jest.spyOn(room_model_1.Room, 'findByPk').mockResolvedValue(null);
        const res = await roomService.deleteRoom(5);
        expect(res).toBe(false);
    });
    it('deleteRoom throws if screenings exist', async () => {
        jest.spyOn(room_model_1.Room, 'findByPk').mockResolvedValue({ idRoom: 7 });
        jest.spyOn(screening_model_1.Screening, 'count').mockResolvedValue(3);
        await expect(roomService.deleteRoom(7)).rejects.toThrow(/screenings/i);
    });
    it('deleteRoom soft-deletes when no screenings', async () => {
        const mockRoom = {
            idRoom: 8,
            update: jest.fn().mockResolvedValue(undefined),
        };
        jest.spyOn(room_model_1.Room, 'findByPk').mockResolvedValue(mockRoom);
        jest.spyOn(screening_model_1.Screening, 'count').mockResolvedValue(0);
        const res = await roomService.deleteRoom(8);
        expect(res).toBe(true);
        expect(mockRoom.update).toHaveBeenCalledWith({ isActive: false });
    });
});
//# sourceMappingURL=room.services.test.js.map