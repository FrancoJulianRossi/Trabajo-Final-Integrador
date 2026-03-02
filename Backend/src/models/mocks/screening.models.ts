import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Movie } from "./movie.model";
import { Room } from "./room.model";

@Table({
  tableName: "screenings",
  timestamps: true,
})
export class Screening extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare idScreening: number;

  @ForeignKey(() => Movie)
  @Column
  declare movieId: number;

  @BelongsTo(() => Movie)
  declare movie: Movie;

  @ForeignKey(() => Room)
  @Column
  declare roomId: number;

  @BelongsTo(() => Room)
  declare room: Room;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare start: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare end: Date;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare ticketPrice: number;
}