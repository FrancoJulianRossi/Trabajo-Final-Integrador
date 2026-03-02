import { User } from "../models/user.model";

export class UserService {
  constructor() {}

  async getAllUsers(): Promise<User[]> {
    return await User.findAll();
  }

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

  async updateUser(
    idUser: number,
    userData: Partial<User>,
  ): Promise<User | null> {
    const user = await User.findByPk(idUser);
    if (!user) {
      return null;
    }
    return await user.update(userData);
  }

  async deleteUser(idUser: number): Promise<boolean> {
    const count = await User.destroy({ where: { idUser } });
    return count > 0;
  }
}
