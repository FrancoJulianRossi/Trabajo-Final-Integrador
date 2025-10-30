import { Movie } from "./entities/movie.entity";

export class MoviesModel {
    private data: Movie[];
    private id: number;

    constructor() {
        this.data = [
            new Movie(
                1,
                "Inception",
                148,
                "Sueños dentro de sueños.",
                "Ciencia ficción",
                "Estreno",
                "Christopher Nolan",
                "Inglés",
                true,
                "https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SL1500_.jpg"
            ),
        ];
        this.id = 2;
    }

    list(): Promise<Movie[]> {
        return Promise.resolve(this.data);
    }

    getById(id: number): Promise<Movie> {
        return new Promise((resolve, reject) => {
            const movie = this.data.find((m) => m.idMovie === id);
            movie ? resolve(movie) : reject(new Error("Película no encontrada"));
        });
    }

    create(movie: Movie): Promise<Movie> {
    return new Promise((resolve, reject) => {
        const exists = this.data.find(
            (m) => m.name.toLowerCase() === movie.name.toLowerCase()
        );
        if (exists) {
            reject(new Error("La película ya existe"));
        } else {
            const newMovie = new Movie(
                this.id++,
                movie.name,
                movie.getDuration(),
                movie.description,
                movie.genre,
                movie.categorie,
                movie.director,
                movie.lenguage,
                movie.isSubtitled(),
                movie.poster
            );
            this.data.push(newMovie);
            resolve(newMovie);
        }
    });
}

    update(id: number, updatedMovie: Movie): Promise<Movie> {
        return new Promise((resolve, reject) => {
            const index = this.data.findIndex((m) => m.idMovie === id);
            if (index === -1) {
                reject(new Error("Película no encontrada"));
            } else {
                const newMovie = new Movie(
                    id,
                    updatedMovie.name,
                    updatedMovie.getDuration(),
                    updatedMovie.description,
                    updatedMovie.genre,
                    updatedMovie.categorie,
                    updatedMovie.director,
                    updatedMovie.lenguage,
                    updatedMovie.isSubtitled(),
                    updatedMovie.poster
                );
                this.data[index] = newMovie;
                resolve(newMovie);
            }
        });
    }

    delete(id: number): Promise<Movie> {
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

export default new MoviesModel();
