export class seat{
    id: string;
    row: number;
    column: number;

    constructor(id: string, row: number, column: number) {
        this.id = id;
        this.row = row;
        this.column = column;
    }

    getId(): string {
        return this.id;
    }

    getSeatPosition(): string {
        return `Row: ${this.row}, Column: ${this.column}`;
    }

}