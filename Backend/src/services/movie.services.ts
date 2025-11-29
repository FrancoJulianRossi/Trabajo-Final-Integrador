import MoviesModel from "../models/mocks/movie.models";
import { Movie } from "../models/mocks/entities/movie.entity";

export class MovieService {
    async list(): Promise<Movie[]> {
        return MoviesModel.list();
    }

    async getById(id: number): Promise<Movie> {
        return MoviesModel.getById(id);
    }

    async create(movie: Movie): Promise<Movie> {
        return MoviesModel.create(movie);
    }

    async update(id: number, movie: Movie): Promise<Movie> {
        return MoviesModel.update(id, movie as any);
    }

    async delete(id: number): Promise<Movie> {
        return MoviesModel.delete(id);
    }
}

export default new MovieService();