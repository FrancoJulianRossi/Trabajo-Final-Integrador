export declare class Room {
    protected id: number;
    protected name: string;
    protected capacity: number;
    protected type: string;
    constructor(id: number, name: string, capacity: number, type: string);
    getId(): number;
    getName(): string;
    getCapacity(): number;
    getType(): string;
    setName(name: string): void;
    setCapacity(capacity: number): void;
    setType(type: string): void;
    isFull(currentOccupancy: number): boolean;
}
//# sourceMappingURL=room.entity.d.ts.map