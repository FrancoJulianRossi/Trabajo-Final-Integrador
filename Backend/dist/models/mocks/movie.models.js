"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesModel = void 0;
const movie_entity_1 = require("./entities/movie.entity");
class MoviesModel {
    data;
    id;
    constructor() {
        this.data = [
            new movie_entity_1.Movie(1, "Inception", 148, "Sueños dentro de sueños.", "Ciencia ficción", "Estreno", "Christopher Nolan", "Inglés", true, "https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SL1500_.jpg"),
        ];
        this.id = 2;
    }
    seed(initial) {
        this.data = initial.map((m, idx) => new movie_entity_1.Movie(m.idMovie || idx + 1, m.name, m.getDuration(), m.description, m.genre, m.categorie, m.director, m.lenguage, m.isSubtitled(), m.poster));
        this.id = this.data.length
            ? Math.max(...this.data.map((x) => x.idMovie)) + 1
            : 1;
    }
    list() {
        return Promise.resolve(this.data);
    }
    getById(id) {
        return new Promise((resolve, reject) => {
            const movie = this.data.find((m) => m.idMovie === id);
            movie ? resolve(movie) : reject(new Error("Película no encontrada"));
        });
    }
    create(movie) {
        return new Promise((resolve, reject) => {
            const exists = this.data.find((m) => m.name.toLowerCase() === movie.name.toLowerCase());
            if (exists) {
                reject(new Error("La película ya existe"));
            }
            else {
                const newMovie = new movie_entity_1.Movie(this.id++, movie.name, movie.getDuration(), movie.description, movie.genre, movie.categorie, movie.director, movie.lenguage, movie.isSubtitled(), movie.poster);
                this.data.push(newMovie);
                resolve(newMovie);
            }
        });
    }
    update(id, updatedMovie) {
        return new Promise((resolve, reject) => {
            const index = this.data.findIndex((m) => m.idMovie === id);
            if (index === -1) {
                reject(new Error("Película no encontrada"));
            }
            else {
                const newMovie = new movie_entity_1.Movie(id, updatedMovie.name, updatedMovie.getDuration(), updatedMovie.description, updatedMovie.genre, updatedMovie.categorie, updatedMovie.director, updatedMovie.lenguage, updatedMovie.isSubtitled(), updatedMovie.poster);
                this.data[index] = newMovie;
                resolve(newMovie);
            }
        });
    }
    delete(id) {
        return new Promise((resolve, reject) => {
            const movie = this.data.find((m) => m.idMovie === id);
            if (!movie) {
                reject(new Error("Película no encontrada"));
                return;
            }
            this.data = this.data.filter((m) => m.idMovie !== id);
            resolve(movie);
        });
    }
}
exports.MoviesModel = MoviesModel;
exports.default = new MoviesModel();
//# sourceMappingURL=movie.models.js.map