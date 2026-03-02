export class User {
  constructor(
    protected idUser: number,
    protected name: string,
    protected email: string,
    protected password: string,
    protected role: boolean
  ) {}
  // GETTERS
  getIdUser(): number {
    return this.idUser;
  }
  getName(): string {
    return this.name;
  }
  getEmail(): string {
    return this.email;
  }
  getPassword(): string {
    return this.password;
  }
  getRole(): boolean {
    return this.role;
  }
  // SETTERS
  setName(name: string): void {
    this.name = name;
  }
  setEmail(email: string): void {
    this.email = email;
  }
  setPassword(password: string): void {
    this.password = password;
  }
  setRole(role: boolean): void {
    this.role = role;
  }
}
