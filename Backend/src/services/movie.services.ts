import { Movie } from "../models/movie.models";

export class MovieService {
    async list(): Promise<Movie[]> {
        return await Movie.findAll();
    }

    async getById(id: number): Promise<Movie | null> {
        const movie = await Movie.findByPk(id);
        if (!movie) throw new Error("Movie not found");
        return movie;
    }

    async create(movieData: Partial<Movie>): Promise<Movie> {
        return await Movie.create(movieData);
    }

    async update(id: number, movieData: Partial<Movie>): Promise<Movie> {
        const movie = await Movie.findByPk(id);
        if (!movie) throw new Error("Movie not found");
        await movie.update(movieData);
        return movie;
    }

    async delete(id: number): Promise<void> {
        const movie = await Movie.findByPk(id);
        if (!movie) throw new Error("Movie not found");
        await movie.destroy();
    }
}

export default new MovieService();