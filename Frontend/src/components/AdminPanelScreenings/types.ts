export interface Movie {
  idMovie?: number;
  name: string;
  length: number;
  description: string;
  genre: string;
  categorie: string;
  director: string;
  lenguage: string;
  subtitles: boolean;
  poster: string;
}

export interface Room {
  idRoom: number;
  name: string;
  capacity: number;
  type: string;
}

export interface Screening {
  idScreening: number;
  movieId?: number;
  roomId?: number; // Add roomId to Screening interface
  date: string; // ISO date or date string
  start: string; // ISO or time
  end?: string;
  ticketPrice: number;
}