export declare class Movie {
    protected IdMovie: number;
    protected Name: string;
    protected Length: number;
    protected Description: string;
    protected Genre: string;
    protected Categorie: string;
    protected Director: string;
    protected Lenguage: string;
    protected Subtitles: boolean;
    protected Poster: string;
    constructor(IdMovie: number, Name: string, Length: number, Description: string, Genre: string, Categorie: string, Director: string, Lenguage: string, Subtitles: boolean, Poster: string);
    get idMovie(): number;
    get name(): string;
    get description(): string;
    get genre(): string;
    get categorie(): string;
    get director(): string;
    get lenguage(): string;
    get poster(): string;
    set name(name: string);
    set length(length: number);
    set description(description: string);
    set genre(genre: string);
    set categorie(categorie: string);
    set director(director: string);
    set lenguage(lenguage: string);
    set subtitles(subtitles: boolean);
    set poster(poster: string);
    getDetails(): string;
    isSubtitled(): boolean;
    getDuration(): number;
}
//# sourceMappingURL=movie.entity.d.ts.map