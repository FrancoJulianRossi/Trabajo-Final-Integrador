import { UserService } from "./user.services";
import { User } from "../models/user.model";

jest.mock("../models/user.model");

const userService = new UserService();

describe("UserService", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("getAllUsers returns list of users", async () => {
    const mockUsers = [
      { idUser: 1, name: "Alice", email: "alice@test.com" },
      { idUser: 2, name: "Bob", email: "bob@test.com" },
    ];
    jest.spyOn(User, "findAll").mockResolvedValue(mockUsers as any);
    const result = await userService.getAllUsers();
    expect(User.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });

  it("getUserById returns user when found", async () => {
    const mockUser = { idUser: 3, name: "Charlie", email: "charlie@test.com" };
    jest.spyOn(User, "findByPk").mockResolvedValue(mockUser as any);
    const result = await userService.getUserById(3);
    expect(User.findByPk).toHaveBeenCalledWith(3);
    expect(result).toBe(mockUser);
  });

  it("getUserById returns null when not found", async () => {
    jest.spyOn(User, "findByPk").mockResolvedValue(null);
    const result = await userService.getUserById(999);
    expect(result).toBeNull();
  });

  it("getUserByEmail finds user by email", async () => {
    const mockUser = { idUser: 4, email: "diana@test.com" };
    jest.spyOn(User, "findOne").mockResolvedValue(mockUser as any);
    const result = await userService.getUserByEmail("diana@test.com");
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: "diana@test.com" },
    });
    expect(result).toBe(mockUser);
  });

  it("createUser creates new user", async () => {
    const payload = {
      name: "Eve",
      email: "eve@test.com",
      password: "hashed",
      role: false,
    };
    const mockUser = { idUser: 5, ...payload };
    jest.spyOn(User, "create").mockResolvedValue(mockUser as any);
    const result = await userService.createUser(payload);
    expect(User.create).toHaveBeenCalledWith(payload);
    expect(result).toBe(mockUser);
  });

  it("updateUser updates existing user", async () => {
    const mockUser: any = {
      update: jest.fn().mockResolvedValue({ idUser: 6, name: "Frank" }),
      idUser: 6,
    };
    jest.spyOn(User, "findByPk").mockResolvedValue(mockUser);
    const data = { name: "Frank" };
    const result = await userService.updateUser(6, data);
    expect(User.findByPk).toHaveBeenCalledWith(6);
    expect(mockUser.update).toHaveBeenCalledWith(data);
    expect(result).toHaveProperty("idUser");
  });

  it("updateUser returns null when user not found", async () => {
    jest.spyOn(User, "findByPk").mockResolvedValue(null);
    const result = await userService.updateUser(999, {});
    expect(result).toBeNull();
  });

  it("deleteUser deletes user and returns true", async () => {
    jest.spyOn(User, "destroy").mockResolvedValue(1);
    const result = await userService.deleteUser(7);
    expect(User.destroy).toHaveBeenCalledWith({ where: { idUser: 7 } });
    expect(result).toBe(true);
  });

  it("deleteUser returns false when user not found", async () => {
    jest.spyOn(User, "destroy").mockResolvedValue(0);
    const result = await userService.deleteUser(999);
    expect(result).toBe(false);
  });
});
