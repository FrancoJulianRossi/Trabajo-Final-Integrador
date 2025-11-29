export declare class User {
    protected idUser: number;
    protected name: string;
    protected email: string;
    protected password: string;
    protected role: boolean;
    constructor(idUser: number, name: string, email: string, password: string, role: boolean);
    getIdUser(): number;
    getName(): string;
    getEmail(): string;
    getPassword(): string;
    getRole(): boolean;
    setName(name: string): void;
    setEmail(email: string): void;
    setPassword(password: string): void;
    setRole(role: boolean): void;
}
//# sourceMappingURL=user.entity.d.ts.map