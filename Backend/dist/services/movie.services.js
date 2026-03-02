"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieService = void 0;
const movie_model_1 = require("../models/movie.model");
class MovieService {
    async list() {
        return await movie_model_1.Movie.findAll();
    }
    async getById(id) {
        const movie = await movie_model_1.Movie.findByPk(id);
        if (!movie)
            throw new Error("Movie not found");
        return movie;
    }
    async create(movieData) {
        // enforce positive length (duration)
        if (movieData.length !== undefined && movieData.length <= 0) {
            throw new Error("Movie length must be a positive number");
        }
        return await movie_model_1.Movie.create(movieData);
    }
    async update(id, movieData) {
        const movie = await movie_model_1.Movie.findByPk(id);
        if (!movie)
            throw new Error("Movie not found");
        if (movieData.length !== undefined && movieData.length <= 0) {
            throw new Error("Movie length must be a positive number");
        }
        await movie.update(movieData);
        return movie;
    }
    async delete(id) {
        const movie = await movie_model_1.Movie.findByPk(id);
        if (!movie)
            throw new Error("Movie not found");
        await movie.destroy();
    }
}
exports.MovieService = MovieService;
exports.default = new MovieService();
//# sourceMappingURL=movie.services.js.map