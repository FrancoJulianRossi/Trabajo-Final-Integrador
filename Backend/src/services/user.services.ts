import { User } from "../models/user.model";

export class UserService {
  constructor() {}

  async getUserById(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    return user;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    return await User.create(userData);
  }
}
