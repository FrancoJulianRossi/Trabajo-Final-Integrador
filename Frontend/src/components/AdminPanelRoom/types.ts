export interface Seat {
  idSeat?: number;
  row: number;
  column: number;
  type: string;
}

export interface Room {
  idRoom: number;
  name: string;
  capacity: number;
  type: string;
  rows: number;
  cols: number;
  isActive: boolean;
  seats?: Seat[];
}