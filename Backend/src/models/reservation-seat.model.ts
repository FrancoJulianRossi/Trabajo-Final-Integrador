import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Reservation } from "./reservation.model";
import { Seat } from "./seat.model";

@Table({
  tableName: "reservation_seats",
  timestamps: false,
})
export class ReservationSeat extends Model {
  @ForeignKey(() => Reservation)
  @Column
  declare reservationId: number;

  @BelongsTo(() => Reservation)
  declare reservation: Reservation;

  @ForeignKey(() => Seat)
  @Column
  declare seatId: number;

  @BelongsTo(() => Seat)
  declare seat: Seat;
}
