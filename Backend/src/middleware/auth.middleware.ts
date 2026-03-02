import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET: string = (process.env.JWT_SECRET ||
  "change_this_secret") as string;

export interface AuthRequest extends Request {
  user?: any;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers["authorization"] as string | undefined;
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ message: "Missing token" });

  const token = (header.split(" ")[1] || "") as string;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (!req.user.role)
    return res.status(403).json({ message: "Admin required" });
  next();
}
