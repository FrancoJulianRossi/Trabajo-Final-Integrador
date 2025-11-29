import { Movie } from "../models/mocks/entities/movie.entity";
export declare class MovieService {
    list(): Promise<Movie[]>;
    getById(id: number): Promise<Movie>;
    create(movie: Movie): Promise<Movie>;
    update(id: number, movie: Movie): Promise<Movie>;
    delete(id: number): Promise<Movie>;
}
declare const _default: MovieService;
export default _default;
//# sourceMappingURL=movie.services.d.ts.map