export interface Seat {
  idSeat: number;
  row: number;
  column: number;
  roomId: number;
}

export interface ReservationSeat {
  reservationId: number;
  seatId: number;
  seat: Seat;
}

export interface User {
  idUser: number;
  name: string;
  email: string;
  role: boolean;
}
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

export interface Screening {
  idScreening: number;
  movieId: number;
  movie?: Movie;
  roomId: number;
  date: string;
  start: string;
  end: string;
  ticketPrice: number;
}

export interface Reservation {
  idReservation: number;
  userId: number;
  user?: User;
  screeningId: number;
  screening: Screening;
  reservationDate: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Paid";
  total: number;
  reservationSeats: ReservationSeat[];
}
