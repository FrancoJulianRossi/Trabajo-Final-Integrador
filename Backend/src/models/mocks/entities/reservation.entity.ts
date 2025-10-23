// import { User } from "./user.entity";
import { Screening } from "../screening";
import { seats } from "../seat.model";

export type ReservationStatus = "Pending" | "Paid" | "Canceled";

export class Reservation{
    constructor (
        protected idReservation: number,
        protected reservationDate: Date,
        protected status: ReservationStatus,
        protected total: number,
        // protected user: User,
        protected screening: Screening,
        protected seat : seats[] = []
    ){}

    getIdReservation(): number{
        return this.idReservation;
    }
    getReservationDate(): Date{
        return this.reservationDate;
    }
    getStatus(): ReservationStatus{
        return this.status;
    }
    getTotal(): number{
        return this.total;
    }
    // getUser(): User{
    //     return this.user;
    // }
    getScreening(): Screening{
        return this.screening;
    }
    getSeat(): seats[]{
        return [...this.seat];
    }

    setReservationDate(reservationDate: Date): void{
        this.reservationDate = reservationDate;
    }
    setStatus(status: ReservationStatus): void{
        this.status = status;
    }
    setTotal(total: number): void{
        this.total = total;
    }

    addSeat(seat: seats): void{
        this.seat.push(seat);
    }

    calculateTotal(): number{
        const price = this.getScreening().ticketPrice;
        return this.getSeat().length * price;
    }
    
    cancelReservation(): void{
        this.setStatus("Canceled");
    }
}