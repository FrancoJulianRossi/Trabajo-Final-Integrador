import { User } from "../models/mocks/entities/user.entity";
import UserMock from "../models/mocks/user.models";

export class UserService {
  constructor() {}

  getUserById(id: number): User | null {
    return UserMock.getUsers().find((user) => user.getIdUser() === id) || null;
  }

  getUserByEmail(email: string): User | null {
    return (
      UserMock.getUsers().find((user) => user.getEmail() === email) || null
    );
  }

  createUser(user: User): void {
    UserMock.getUsers().push(user);
  }
}
