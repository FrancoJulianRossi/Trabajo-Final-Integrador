import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
// import { Seat } from './seat';
// import { Movie } from './movie';

interface ScreeningAttributes {
  idScreening: number;
  date: Date;
  start: Date;
  end: Date;
  ticketPrice: number;
}

interface ScreeningCreationAttributes extends Optional<ScreeningAttributes, 'idScreening'> {}

export class Screening extends Model<ScreeningAttributes, ScreeningCreationAttributes>
  implements ScreeningAttributes {
  public idScreening!: number;
  public date!: Date;
  public start!: Date;
  public end!: Date;
  public ticketPrice!: number;

  // Métodos de instancia

  public getDuration(): number {
    const startTime = new Date(this.start).getTime();
    const endTime = new Date(this.end).getTime();
    const durationMinutes = Math.floor((endTime - startTime) / 60000);
    return durationMinutes;
  }

  public async getAvailableSeats(): Promise<any[]> {
    // Placeholder: debería consultar la tabla Seat y filtrar por disponibilidad
    // return await Seat.findAll({ where: { available: true, idScreening: this.idScreening } });
    return [];
  }

  public async getMovieTitle(): Promise<string> {
    // Placeholder: cuando se implemente la relación con Movie
    // const movie = await Movie.findOne({ where: { idScreening: this.idScreening } });
    // return movie ? movie.name : 'Unknown';
    return 'Unknown';
  }

  public isAvailable(): boolean {
    return Date.now() < new Date(this.start).getTime();
  }
}

Screening.init(
  {
    idScreening: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ticketPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Screening',
    tableName: 'screenings', // <-- cambiar aquí si tu tabla se llama 'screenings'
    timestamps: false,
  }
);

// Relaciones (para agregar cuando los otros modelos estén listos)
// Screening.hasMany(Seat, { foreignKey: 'ScreeningId' });
// Screening.belongsTo(Movie, { foreignKey: 'movieId' });ssss

export default Screening;
