import { User } from "../models/user.model";
export declare class UserService {
    constructor();
    getAllUsers(): Promise<User[]>;
    getUserById(id: number): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    createUser(userData: Partial<User>): Promise<User>;
    updateUser(idUser: number, userData: Partial<User>): Promise<User | null>;
    deleteUser(idUser: number): Promise<boolean>;
}
//# sourceMappingURL=user.services.d.ts.map