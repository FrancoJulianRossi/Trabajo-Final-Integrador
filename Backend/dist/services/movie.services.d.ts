import { Movie } from "../models/movie.model";
export declare class MovieService {
    list(): Promise<Movie[]>;
    getById(id: number): Promise<Movie | null>;
    create(movieData: Partial<Movie>): Promise<Movie>;
    update(id: number, movieData: Partial<Movie>): Promise<Movie>;
    delete(id: number): Promise<void>;
}
declare const _default: MovieService;
export default _default;
//# sourceMappingURL=movie.services.d.ts.map