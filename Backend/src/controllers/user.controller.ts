import { UserService } from "../services/user.services";
import { Request, Response } from "express";

export class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, role = false } = req.body;
      await this.userService.createUser({ name, email, password, role });
      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error creating user" });
    }
  }
}
