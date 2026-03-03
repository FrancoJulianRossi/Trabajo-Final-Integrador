import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "carousel_items",
  timestamps: true,
})
export class Carousel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare subtitle: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare desktopImageUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare mobileImageUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare link: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare order: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isActive: boolean;
}

// Interfaz para el tipo de datos (útil para el frontend)
export interface ICarouselItem {
  id: number;
  title: string;
  subtitle: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  link: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
