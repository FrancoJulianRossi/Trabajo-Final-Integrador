export class seats{
    id: string;
    row: number;
    column: number;

    constructor(id: string, row: number, column: number) {
        this.id = id;
        this.row = row;
        this.column = column;
    }

    getSeatPosition(): string {
        return `Row: ${this.row}, Column: ${this.column}`;
    }

}