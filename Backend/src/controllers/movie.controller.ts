import { Request, Response } from "express";
import movieService from "../services/movie.services";

class MoviesController {
    async list(req: Request, res: Response) {
        try {
            const movies = await movieService.list();
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
            const movie = await movieService.getById(parseInt(id));
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

            const created = await movieService.create({
                name,
                length,
                description,
                genre,
                categorie,
                director,
                lenguage,
                subtitles,
                poster
            });
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
            const movie = await movieService.update(parseInt(id), updatedMovie);
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
            await movieService.delete(parseInt(id));
            res.status(200).json({ message: "Movie deleted" });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }
}

export default new MoviesController();