import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Index,
} from "sequelize-typescript";
import { Reservation } from "./reservation.model";
import { Seat } from "./seat.model";
import { Screening } from "./screening.model";

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

  // keep a copy of screeningId to enforce unique constraint at DB level
  @ForeignKey(() => Screening)
  @Column
  @Index({ name: "uniq_seat_screening", unique: true })
  declare screeningId: number;

  @ForeignKey(() => Seat)
  @Column
  @Index({ name: "uniq_seat_screening", unique: true })
  declare seatId: number;

  @BelongsTo(() => Seat)
  declare seat: Seat;
}
