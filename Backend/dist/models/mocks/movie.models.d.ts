import { Movie } from "./entities/movie.entity";
export declare class MoviesModel {
    private data;
    private id;
    constructor();
    seed(initial: Movie[]): void;
    list(): Promise<Movie[]>;
    getById(id: number): Promise<Movie>;
    create(movie: Movie): Promise<Movie>;
    update(id: number, updatedMovie: Movie): Promise<Movie>;
    delete(id: number): Promise<Movie>;
}
declare const _default: MoviesModel;
export default _default;
//# sourceMappingURL=movie.models.d.ts.map