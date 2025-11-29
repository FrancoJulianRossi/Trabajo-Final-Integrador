import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { User } from "../models/mocks/entities/user.entity";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export class AuthController {
  private userService = new UserService();

  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existing = this.userService.getUserByEmail(email);
    if (existing) return res.status(409).json({ message: "Email in use" });

    const hashed = await bcrypt.hash(password, 10);
    const id = Date.now();
    const newUser = new User(id, name, email, hashed, false);
    this.userService.createUser(newUser);
    return res.status(201).json({ message: "User registered" });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing email or password" });

    const user = this.userService.getUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.getPassword());
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const payload = {
      idUser: user.getIdUser(),
      email: user.getEmail(),
      role: user.getRole(),
    };
    const token = jwt.sign(payload as any, JWT_SECRET, { expiresIn: "8h" });
    return res.status(200).json({
      token,
      user: {
        idUser: user.getIdUser(),
        name: user.getName(),
        email: user.getEmail(),
        role: user.getRole(),
      },
    });
  }
}

export default new AuthController();
