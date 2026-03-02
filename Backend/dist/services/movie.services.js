"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieService = void 0;
const movie_models_1 = __importDefault(require("../models/mocks/movie.models"));
class MovieService {
    async list() {
        return movie_models_1.default.list();
    }
    async getById(id) {
        return movie_models_1.default.getById(id);
    }
    async create(movie) {
        return movie_models_1.default.create(movie);
    }
    async update(id, movie) {
        return movie_models_1.default.update(id, movie);
    }
    async delete(id) {
        return movie_models_1.default.delete(id);
    }
}
exports.MovieService = MovieService;
exports.default = new MovieService();
//# sourceMappingURL=movie.services.js.map