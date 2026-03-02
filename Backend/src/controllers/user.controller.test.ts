import request from "supertest";
import app from "../app";
import { UserService } from "../services/user.services";
import bcrypt from "bcryptjs";

// stub authentication middleware so requests look authenticated and carry an idUser
jest.mock("../middleware/auth.middleware", () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { idUser: 42 };
    next();
  },
  requireAdmin: (req: any, res: any, next: any) => next(),
}));

jest.mock("../services/user.services");
const mockedUserService = UserService as jest.MockedClass<typeof UserService>;

describe("UserController profile routes", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("GET /api/users/me returns current user without password", async () => {
    const fakeUser: any = {
      idUser: 42,
      name: "Test",
      email: "t@example.com",
      password: "secret",
    };
    mockedUserService.prototype.getUserById.mockResolvedValue(fakeUser);

    const res = await request(app).get("/api/users/me");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      idUser: 42,
      name: "Test",
      email: "t@example.com",
      role: fakeUser.role,
    });
    expect(res.body).not.toHaveProperty("password");
  });

  it("PUT /api/users/me updates basic fields", async () => {
    const fakeUser: any = {
      idUser: 42,
      name: "Old",
      email: "old@x.com",
      password: "hash",
      role: false,
    };
    mockedUserService.prototype.getUserById.mockResolvedValue(fakeUser);
    const updated = {
      idUser: 42,
      name: "New",
      email: "new@x.com",
      role: false,
    } as any;
    mockedUserService.prototype.updateUser.mockResolvedValue(updated);

    const res = await request(app)
      .put("/api/users/me")
      .send({ name: "New", email: "new@x.com" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
  });

  it("PUT /api/users/me changing password without currentPassword fails", async () => {
    const fakeUser: any = { idUser: 42, password: "hash" };
    mockedUserService.prototype.getUserById.mockResolvedValue(fakeUser);

    const res = await request(app)
      .put("/api/users/me")
      .send({ password: "newpass" });
    expect(res.status).toBe(400);
  });

  it("PUT /api/users/me with wrong currentPassword returns 401", async () => {
    const fakeUser: any = { idUser: 42, password: "hash" };
    mockedUserService.prototype.getUserById.mockResolvedValue(fakeUser);
    const compareSpy: any = jest.spyOn(bcrypt, "compare");
    compareSpy.mockResolvedValue(false);

    const res = await request(app)
      .put("/api/users/me")
      .send({ password: "newpass", currentPassword: "wrong" });
    expect(res.status).toBe(401);
  });

  it("PUT /api/users/me with correct currentPassword updates and hashes", async () => {
    const fakeUser: any = { idUser: 42, password: "hash", role: false };
    mockedUserService.prototype.getUserById.mockResolvedValue(fakeUser);
    const compareSpy: any = jest.spyOn(bcrypt, "compare");
    compareSpy.mockResolvedValue(true);
    const hashSpy: any = jest.spyOn(bcrypt, "hash");
    hashSpy.mockResolvedValue("newhash");

    mockedUserService.prototype.updateUser.mockResolvedValue({
      idUser: 42,
      name: "X",
      email: "x@x.com",
      role: false,
    } as any);

    const res = await request(app)
      .put("/api/users/me")
      .send({ password: "newpass", currentPassword: "oldpass" });
    expect(res.status).toBe(200);
    expect(hashSpy).toHaveBeenCalledWith("newpass", 10);
  });
});
