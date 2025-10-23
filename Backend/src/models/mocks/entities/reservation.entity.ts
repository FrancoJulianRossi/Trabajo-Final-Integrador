import { User } from "./user.entity";
import { Screening } from "./screening.entity";
import { Seat } from "./seat.entity";
export class Reservation{
    constructor (
        protected idReservation: number,
        protected reservationDate: Date,
        protected status: "Pendiente" | "Confirmada" | "Cancelada",
        protected total: number,
        protected user: User,
        protected screening: Screening,
        protected seat: Seat
    ){}

    getIdReservation(): number{
        return this.idReservation;
    }
    getReservationDate(): Date{
        return this.reservationDate;
    }
    getStatus(): "Pendiente" | "Confirmada" | "Cancelada"{
        return this.status;
    }
    getTotal(): number{
        return this.total;
    }
    getUser(): User{
        return this.user;
    }
    getScreening(): Screening{
        return this.screening;
    }
    getSeat(): Seat{
        return this.seat;
    }

    setReservationDate(reservationDate: Date): void{
        this.reservationDate = reservationDate;
    }
    setStatus(status: "Pendiente" | "Confirmada" | "Cancelada"): void{
        this.status = status;
    }
    setTotal(total: number): void{
        this.total = total;
    }
}