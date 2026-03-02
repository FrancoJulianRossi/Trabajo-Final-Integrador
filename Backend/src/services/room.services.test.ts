import { RoomService } from './room.services';
import { Room } from '../models/room.model';
import { Screening } from '../models/screening.model';

jest.mock('../models/room.model');
jest.mock('../models/screening.model');

const roomService = new RoomService();

describe('RoomService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('deleteRoom returns false if room not found', async () => {
    jest.spyOn(Room, 'findByPk').mockResolvedValue(null);
    const res = await roomService.deleteRoom(5);
    expect(res).toBe(false);
  });

  it('deleteRoom throws if screenings exist', async () => {
    jest.spyOn(Room, 'findByPk').mockResolvedValue({ idRoom: 7 } as any);
    jest.spyOn(Screening, 'count').mockResolvedValue(3);
    await expect(roomService.deleteRoom(7)).rejects.toThrow(/screenings/i);
  });

  it('deleteRoom soft-deletes when no screenings', async () => {
    const mockRoom: any = {
      idRoom: 8,
      update: jest.fn().mockResolvedValue(undefined),
    };
    jest.spyOn(Room, 'findByPk').mockResolvedValue(mockRoom);
    jest.spyOn(Screening, 'count').mockResolvedValue(0);
    const res = await roomService.deleteRoom(8);
    expect(res).toBe(true);
    expect(mockRoom.update).toHaveBeenCalledWith({ isActive: false });
  });
});
