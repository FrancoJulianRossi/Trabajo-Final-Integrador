import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { Seat } from "./seat.model";

@Table({
  tableName: "rooms",
  timestamps: false,
})
export class Room extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare idRoom: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare capacity: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare type: string;

  @HasMany(() => Seat)
  declare seats: Seat[];
}