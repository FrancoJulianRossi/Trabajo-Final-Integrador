import { User } from "../models/mocks/entities/user.entity";
export declare class UserService {
    constructor();
    getUserById(id: number): User | null;
    getUserByEmail(email: string): User | null;
    createUser(user: User): void;
}
//# sourceMappingURL=user.services.d.ts.map