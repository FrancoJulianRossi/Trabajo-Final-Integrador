"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const movie_services_1 = __importDefault(require("../services/movie.services"));
const movie_entity_1 = require("../models/mocks/entities/movie.entity");
class MoviesController {
    async list(req, res) {
        try {
            const movies = await movie_services_1.default.list();
            res.status(200).json(movies);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getById(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ message: "ID no proporcionado" });
            }
            const movie = await movie_services_1.default.getById(parseInt(id));
            res.status(200).json(movie);
        }
        catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
    async create(req, res) {
        try {
            const { name, length, description, genre, categorie, director, lenguage, subtitles, poster, } = req.body;
            const newMovie = new movie_entity_1.Movie(0, name, length, description, genre, categorie, director, lenguage, subtitles, poster);
            const created = await movie_services_1.default.create(newMovie);
            res.status(201).json(created);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async update(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ message: "ID no proporcionado" });
            }
            const updatedMovie = req.body;
            const movie = await movie_services_1.default.update(parseInt(id), updatedMovie);
            res.status(200).json(movie);
        }
        catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
    async delete(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ message: "ID no proporcionado" });
            }
            const deleted = await movie_services_1.default.delete(parseInt(id));
            res.status(200).json(deleted);
        }
        catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}
exports.default = new MoviesController();
//# sourceMappingURL=movie.controller.js.map