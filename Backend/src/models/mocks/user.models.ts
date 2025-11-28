import { User } from "./entities/user.entity";

export class UserMock {
  private data: User[];
  constructor() {
    this.data = [];
    this.data.push(
      new User(1, "John Doe", "kYz3K@example.com", "1234", true),
      new User(2, "Jane Doe", "gA9LW@example.com", "1234", false)
    );
  }
  public getUsers(): User[] {
    return this.data;
  }
}

const userMockInstance = new UserMock();

export default userMockInstance;

// allow seeding users
export function seedUsers(
  initial: {
    idUser?: number;
    name: string;
    email: string;
    password: string;
    role: boolean;
  }[]
) {
  // Update the default exported instance
  (userMockInstance as any).data = initial.map(
    (u, idx) =>
      new User(u.idUser ?? idx + 1, u.name, u.email, u.password, u.role)
  );
  return userMockInstance;
}
