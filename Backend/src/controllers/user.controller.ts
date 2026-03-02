import { UserService } from "../services/user.services";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

export class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching users" });
    }
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, role = false } = req.body;
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }
      const createdUser = await this.userService.createUser({
        name,
        email,
        password,
        role,
      });
      return res.status(201).json(createdUser); // Return created user
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<Response> {
    const idUser = Number(req.params.id);
    if (isNaN(idUser)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
      const { name, email, password, role } = req.body;
      const updatedUser = await this.userService.updateUser(idUser, {
        name,
        email,
        password,
        role,
      });
      if (updatedUser) {
        return res.status(200).json(updatedUser);
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    const idUser = Number(req.params.id);
    if (isNaN(idUser)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
      const success = await this.userService.deleteUser(idUser);
      if (success) {
        return res.status(200).json({ message: "User deleted successfully" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  // profile operations for authenticated user
  async getProfile(req: any, res: Response): Promise<Response> {
    const idUser = req.user?.idUser;
    if (!idUser) return res.status(401).json({ message: "Not authenticated" });

    try {
      const user = await this.userService.getUserById(idUser);
      if (!user) return res.status(404).json({ message: "User not found" });
      const { password, ...data } = user.toJSON() as any;
      return res.status(200).json(data);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  async updateProfile(req: any, res: Response): Promise<Response> {
    const idUser = req.user?.idUser;
    if (!idUser) return res.status(401).json({ message: "Not authenticated" });

    const { name, email, password, currentPassword } = req.body;
    try {
      const user = await this.userService.getUserById(idUser);
      if (!user) return res.status(404).json({ message: "User not found" });

      // if changing password, verify current password
      if (password) {
        if (!currentPassword) {
          return res
            .status(400)
            .json({ message: "Current password required to change password" });
        }
        const ok = await bcrypt.compare(currentPassword, user.password);
        if (!ok) {
          return res
            .status(401)
            .json({ message: "Current password is incorrect" });
        }
        user.password = await bcrypt.hash(password, 10);
      }

      const updated = await this.userService.updateUser(idUser, {
        name,
        email,
        password: user.password,
      });
      if (!updated)
        return res.status(404).json({ message: "User not found after update" });
      const { password: pwd, ...data } = updated.toJSON() as any;
      return res.status(200).json(data);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
}
