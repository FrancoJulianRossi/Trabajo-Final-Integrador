import { User } from "./entities/user.entity";
export declare class UserMock {
    private data;
    constructor();
    getUsers(): User[];
}
declare const userMockInstance: UserMock;
export default userMockInstance;
export declare function seedUsers(initial: {
    idUser?: number;
    name: string;
    email: string;
    password: string;
    role: boolean;
}[]): UserMock;
//# sourceMappingURL=user.models.d.ts.map