import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
    tableName: "movies",
    timestamps: true,
})
export class Movie extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    declare idMovie: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare length: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare description: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare genre: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare categorie: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare director: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare lenguage: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare subtitles: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare poster: string;
}