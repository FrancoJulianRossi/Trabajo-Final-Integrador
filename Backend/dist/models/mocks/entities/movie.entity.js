"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
class Movie {
    IdMovie;
    Name;
    Length;
    Description;
    Genre;
    Categorie;
    Director;
    Lenguage;
    Subtitles;
    Poster;
    constructor(IdMovie, Name, Length, Description, Genre, Categorie, Director, Lenguage, Subtitles, Poster) {
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
    get idMovie() {
        return this.IdMovie;
    }
    get name() {
        return this.Name;
    }
    get description() {
        return this.Description;
    }
    get genre() {
        return this.Genre;
    }
    get categorie() {
        return this.Categorie;
    }
    get director() {
        return this.Director;
    }
    get lenguage() {
        return this.Lenguage;
    }
    get poster() {
        return this.Poster;
    }
    //setters
    set name(name) {
        this.Name = name;
    }
    set length(length) {
        this.Length = length;
    }
    set description(description) {
        this.Description = description;
    }
    set genre(genre) {
        this.Genre = genre;
    }
    set categorie(categorie) {
        this.Categorie = categorie;
    }
    set director(director) {
        this.Director = director;
    }
    set lenguage(lenguage) {
        this.Lenguage = lenguage;
    }
    set subtitles(subtitles) {
        this.Subtitles = subtitles;
    }
    set poster(poster) {
        this.Poster = poster;
    }
    //Metodos 
    getDetails() {
        return `${this.Name} (${this.Genre}) - Dirigida por ${this.Director}. Duración: ${this.Length} minutos.
        Idioma: ${this.Lenguage}${this.Subtitles ? "(Subtitulada)" : ""}.
        Categoria: ${this.Categorie}.
        Descripción: ${this.Description}`;
    }
    isSubtitled() {
        return this.Subtitles;
    }
    getDuration() {
        return this.Length;
    }
}
exports.Movie = Movie;
//# sourceMappingURL=movie.entity.js.map