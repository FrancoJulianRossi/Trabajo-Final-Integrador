import request from "supertest";
import app from "../app";
import AuthController from "./auth.controller";
import { UserService } from "../services/user.services";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../services/user.services");

const mockedUserService = UserService as jest.MockedClass<typeof UserService>;

describe("AuthController routes", () => {
  beforeEach(() => {
    mockedUserService.prototype.getUserByEmail.mockClear();
    mockedUserService.prototype.createUser.mockClear();
    mockedUserService.prototype.getUserById.mockClear?.();
    mockedUserService.prototype.updateUser.mockClear?.();
  });

  it("POST /api/auth/register fails when missing fields", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.status).toBe(400);
  });

  it("POST /api/auth/register returns 409 if email exists", async () => {
    mockedUserService.prototype.getUserByEmail.mockResolvedValue({
      idUser: 1,
      email: "a",
    } as any);
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "x", email: "a", password: "p" });
    expect(res.status).toBe(409);
  });

  it("POST /api/auth/register success", async () => {
    mockedUserService.prototype.getUserByEmail.mockResolvedValue(null);
    mockedUserService.prototype.createUser.mockResolvedValue({
      idUser: 2,
      email: "b",
    } as any);
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "x", email: "b", password: "p" });
    expect(res.status).toBe(201);
  });

  it("POST /api/auth/login handles missing fields", async () => {
    let res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);

    mockedUserService.prototype.getUserByEmail.mockResolvedValue(null);
    res = await request(app)
      .post("/api/auth/login")
      .send({ email: "no", password: "p" });
    expect(res.status).toBe(401);
  });

  it("POST /api/auth/login returns token when credentials valid", async () => {
    const fakeUser = {
      idUser: 3,
      email: "c",
      password: "hashed",
      name: "C",
      role: false,
    } as any;
    mockedUserService.prototype.getUserByEmail.mockResolvedValue(fakeUser);
    const compareSpy: any = jest.spyOn(bcrypt, "compare");
    compareSpy.mockResolvedValue(true);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "c", password: "p" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toMatchObject({ idUser: 3, email: "c" });
  });

  describe("password recovery", () => {
    it("POST /api/auth/forgot-password requires email", async () => {
      const res = await request(app).post("/api/auth/forgot-password").send({});
      expect(res.status).toBe(400);
    });

    it("POST /api/auth/forgot-password returns success even if user missing", async () => {
      mockedUserService.prototype.getUserByEmail.mockResolvedValue(null);
      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "noone@example.com" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");
    });

    it("POST /api/auth/forgot-password returns token when user exists", async () => {
      const fakeUser = { idUser: 5, email: "foo@example.com" } as any;
      mockedUserService.prototype.getUserByEmail.mockResolvedValue(fakeUser);
      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "foo@example.com" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      // verify token decodable
      const payload = jwt.verify(
        res.body.token,
        process.env.JWT_SECRET || "change_this_secret",
      ) as any;
      expect(payload.idUser).toBe(5);
    });

    it("POST /api/auth/reset-password checks fields", async () => {
      let res = await request(app).post("/api/auth/reset-password").send({});
      expect(res.status).toBe(400);
    });

    it("POST /api/auth/reset-password rejects invalid token", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({ token: "bad", newPassword: "123" });
      expect(res.status).toBe(400);
    });

    it("POST /api/auth/reset-password works with valid token", async () => {
      const fakeUser = {
        idUser: 7,
        email: "bar@example.com",
        password: "x",
      } as any;
      mockedUserService.prototype.getUserById.mockResolvedValue(fakeUser);
      const updateSpy = mockedUserService.prototype.updateUser;
      const token = jwt.sign(
        { idUser: 7 },
        process.env.JWT_SECRET || "change_this_secret",
        { expiresIn: "1h" },
      );
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({ token, newPassword: "newpass" });
      expect(res.status).toBe(200);
      expect(updateSpy).toHaveBeenCalledWith(
        7,
        expect.objectContaining({ password: expect.any(String) }),
      );
    });
  });
});
