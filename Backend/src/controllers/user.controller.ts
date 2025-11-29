import { UserService } from "../services/user.services";
import { Request, Response } from "express";
import { User } from "../models/mocks/entities/user.entity";

export class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    const { idUser, name, email, password, role = 1 } = req.body;
    const newUser = new User(idUser, name, email, password, role);
    this.userService.createUser(newUser);
    return res.status(201).json({ message: "User created successfully" });
  }
}
