// import { User } from "./user.entity";
import { ScreeningEntity } from "./screening.entity";
import { seat } from "./seat.entity";  

export type ReservationStatus = "Pending" | "Paid" | "Canceled";

export class Reservation{
    constructor (
        protected idReservation: number,
        protected reservationDate: Date,
        protected status: ReservationStatus,
        protected total: number,
        // protected user: User,
        protected screening: ScreeningEntity,
        protected seat : seat[] = []
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
    getScreening(): ScreeningEntity{
        return this.screening;
    }
    getSeat(): seat[]{
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

    addSeat(seat: seat): void{
        this.seat.push(seat);
    }

    calculateTotal(): number{
        const price = this.getScreening().getTicketPrice();
        return this.getSeat().length * price;
    }
    
    cancelReservation(): void{
        this.setStatus("Canceled");
    }
}