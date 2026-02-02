import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Room } from "./room.model";

@Table({
  tableName: "seats",
  timestamps: false,
})
export class Seat extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare idSeat: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare row: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare column: number;

  @ForeignKey(() => Room)
  @Column
  declare roomId: number;

  @BelongsTo(() => Room)
  declare room: Room;
}