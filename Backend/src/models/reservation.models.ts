import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { User } from "./user.model";
import { Screening } from "./screening.model";
import { ReservationSeat } from "./reservation-seat.model";

@Table({
  tableName: "reservations",
  timestamps: true,
})
export class Reservation extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare idReservation: number;

  @ForeignKey(() => User)
  @Column
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @ForeignKey(() => Screening)
  @Column
  declare screeningId: number;

  @BelongsTo(() => Screening)
  declare screening: Screening;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  declare reservationDate: Date;

  @Column({
    type: DataType.STRING,
    defaultValue: "Pending",
  })
  declare status: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare total: number;

  @HasMany(() => ReservationSeat)
  declare reservationSeats: ReservationSeat[];
}
