export class seat{
    id: number;
    row: number;
    column: number;

    constructor(id: number, row: number, column: number) {
        this.id = id;
        this.row = row;
        this.column = column;
    }

    getId(): number {
        return this.id;
    }

    getSeatPosition(): string {
        return `Row: ${this.row}, Column: ${this.column}`;
    }

}