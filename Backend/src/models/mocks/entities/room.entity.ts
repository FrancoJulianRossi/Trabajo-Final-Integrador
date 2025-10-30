export class Room {
  protected id: string;
  protected name: string;
  protected capacity: number;
  protected type: string;

  constructor(id: string, name: string, capacity: number, type: string) {
    this.id = id;
    this.name = name;
    this.capacity = capacity;
    this.type = type;
  }

getId(): string {
    return this.id;
  }

getName(): string {
    return this.name;
  }

getCapacity(): number {
    return this.capacity;
  }

getType(): string {
    return this.type;
  }

setName(name: string): void {
    this.name = name;
  }

setCapacity(capacity: number): void {
    this.capacity = capacity;
  }

setType(type: string): void {
    this.type = type;
  }

isFull(currentOccupancy: number): boolean {
    return currentOccupancy >= this.capacity;
  }
}
