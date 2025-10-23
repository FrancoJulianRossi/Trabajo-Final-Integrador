export class Room {
  private id: string;
  private name: string;
  private capacity: number;
  private type: string;

  constructor(id: string, name: string, capacity: number, type: string) {
    this.id = id;
    this.name = name;
    this.capacity = capacity;
    this.type = type;
  }

getType(): string {
    return this.type;
  }
isFull(currentOccupancy: number): boolean {
    return currentOccupancy >= this.capacity;
  }
}
