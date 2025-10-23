export class Movie {
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

    constructor(
        IdMovie: number,
        Name: string,
        Length: number,
        Description: string,
        Genre: string,
        Categorie: string,
        Director: string,
        Lenguage: string,
        Subtitles: boolean,
        Poster: string
    ) {
        this.IdMovie = IdMovie;
        this.Name = Name;
        this.Length = Length;
        this.Description = Description;
        this.Genre = Genre;
        this.Categorie = Categorie;
        this.Director = Director;
        this.Lenguage = Lenguage;
        this.Subtitles = Subtitles;
        this.Poster = Poster;
    }

    //getters
    get idMovie(): number {
        return this.IdMovie;
    }
    get name(): string {
        return this.Name;
    }
    get description(): string {
        return this.Description;
    }
    get genre(): string {
        return this.Genre;
    }
    get categorie(): string {
        return this.Categorie;
    }
    get director(): string {
        return this.Director;
    }
    get lenguage(): string {
        return this.Lenguage;
    }
    get poster(): string {
        return this.Poster;
    }

    //setters
    set name(name: string) {
        this.Name = name;
    }
    set length(length: number) {
        this.Length = length;
    }
    set description(description: string) {
        this.Description = description;
    }
    set genre(genre: string) {
        this.Genre = genre;
    }
    set categorie(categorie: string) {
        this.Categorie = categorie;
    }
    set director(director: string) {
        this.Director = director;
    }
    set lenguage(lenguage: string) {
        this.Lenguage = lenguage;
    }
    set subtitles(subtitles: boolean) {
        this.Subtitles = subtitles;
    }
    set poster(poster: string) {
        this.Poster = poster;
    }

    //Metodos 
    getDetails(): string {
        return `${this.Name} (${this.Genre}) - Dirigida por ${this.Director}. Duración: ${this.Length} minutos.
        Idioma: ${this.Lenguage}${this.Subtitles ? "(Subtitulada)" : ""}.
        Categoria: ${this.Categorie}.
        Descripción: ${this.Description}`;
    }

    isSubtitled(): boolean{
        return this.Subtitles;
    }

    getDuration(): number {
        return this.Length;
    }
}
