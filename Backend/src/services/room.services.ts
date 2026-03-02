import { Room } from "../models/room.model";
import { Seat } from "../models/seat.model";
import { sequelize } from "../config/database";

export class RoomService {
  async getRoomById(id: number): Promise<Room | null> {
    return await Room.findOne({
      where: { idRoom: id, isActive: true },
      include: ["seats"],
    });
  }

  async getRoomSeats(roomId: number): Promise<Seat[]> {
    const room = await Room.findOne({
      where: { idRoom: roomId, isActive: true },
      include: ["seats"],
    });
    if (!room) return [];
    return room.seats || [];
  }

  async getAllRooms(): Promise<Room[]> {
    return await Room.findAll({
      where: { isActive: true },
      include: ["seats"],
    });
  }

  async createRoom(data: {
    name: string;
    type: string;
    rows: number;
    cols: number;
    seats?: { row: number; column: number; type: string }[];
  }): Promise<Room> {
    const t = await sequelize.transaction();
    try {
      const { name, type, rows, cols, seats } = data;

      if (rows < 1 || cols < 1) {
        throw new Error("Rows and columns must be greater than 0");
      }

      // If seats are provided, use them. Otherwise, generate standard seats.
      const seatsToCreate = [];
      let capacity = 0;

      if (seats && seats.length > 0) {
        for (const s of seats) {
          seatsToCreate.push(s);
          if (s.type !== "Empty") {
            capacity++;
          }
        }
      } else {
        for (let r = 1; r <= rows; r++) {
          for (let c = 1; c <= cols; c++) {
            seatsToCreate.push({
              row: r,
              column: c,
              type: "Standard",
            });
            capacity++;
          }
        }
      }

      const room = await Room.create(
        {
          name,
          type,
          rows,
          cols,
          capacity,
          isActive: true,
        },
        { transaction: t },
      );

      const seatsWithRoomId = seatsToCreate.map((s) => ({
        ...s,
        roomId: room.idRoom,
      }));

      await Seat.bulkCreate(seatsWithRoomId, { transaction: t });

      await t.commit();

      return (await Room.findByPk(room.idRoom, { include: ["seats"] })) as Room;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async updateRoom(
    id: number,
    data: Partial<Room> & {
      seats?: { row: number; column: number; type: string }[];
    },
  ): Promise<Room | null> {
    const t = await sequelize.transaction();
    try {
      const room = await Room.findByPk(id);
      if (!room) return null;

      // If dimensions change, we might need to recreate seats or handle it carefully.
      // For now, let's allow updating basic info and seat configuration.
      
      if (data.seats) {
        // Remove old seats and create new ones
        await Seat.destroy({ where: { roomId: id }, transaction: t });
        
        const seatsWithRoomId = data.seats.map((s) => ({
          ...s,
          roomId: id,
        }));
        await Seat.bulkCreate(seatsWithRoomId, { transaction: t });
        
        // Recalculate capacity
        data.capacity = data.seats.filter(s => s.type !== 'Empty').length;
      }

      await room.update(data, { transaction: t });
      await t.commit();
      
      return await Room.findByPk(id, { include: ["seats"] });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async deleteRoom(id: number): Promise<boolean> {
    const room = await Room.findByPk(id);
    if (!room) return false;
    
    // Soft delete
    await room.update({ isActive: false });
    return true;
  }
}