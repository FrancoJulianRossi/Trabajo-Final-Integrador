import { Request, Response } from "express";
import MoviesModel from "../models/mocks/movie.models";
import { Movie } from "../models/mocks/entities/movie.entity";

class MoviesController {
    async list(req: Request, res: Response) {
        try {
            const movies = await MoviesModel.list();
            res.status(200).json(movies);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ message: "ID no proporcionado" });
            }
            const movie = await MoviesModel.getById(parseInt(id));
            res.status(200).json(movie);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const {
                name,
                length,
                description,
                genre,
                categorie,
                director,
                lenguage,
                subtitles,
                poster,
            } = req.body;

            const newMovie = new Movie(
                0,
                name,
                length,
                description,
                genre,
                categorie,
                director,
                lenguage,
                subtitles,
                poster
            );

            const created = await MoviesModel.create(newMovie);
            res.status(201).json(created);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ message: "ID no proporcionado" });
            }
            const updatedMovie = req.body;
            const movie = await MoviesModel.update(parseInt(id), updatedMovie);
            res.status(200).json(movie);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ message: "ID no proporcionado" });
            }
            const deleted = await MoviesModel.delete(parseInt(id));
            res.status(200).json(deleted);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }
}

export default new MoviesController();
