"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_services_1 = require("./user.services");
const user_model_1 = require("../models/user.model");
jest.mock('../models/user.model');
const userService = new user_services_1.UserService();
describe('UserService', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('getAllUsers returns list of users', async () => {
        const mockUsers = [
            { idUser: 1, name: 'Alice', email: 'alice@test.com' },
            { idUser: 2, name: 'Bob', email: 'bob@test.com' },
        ];
        jest.spyOn(user_model_1.User, 'findAll').mockResolvedValue(mockUsers);
        const result = await userService.getAllUsers();
        expect(user_model_1.User.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockUsers);
    });
    it('getUserById returns user when found', async () => {
        const mockUser = { idUser: 3, name: 'Charlie', email: 'charlie@test.com' };
        jest.spyOn(user_model_1.User, 'findByPk').mockResolvedValue(mockUser);
        const result = await userService.getUserById(3);
        expect(user_model_1.User.findByPk).toHaveBeenCalledWith(3);
        expect(result).toBe(mockUser);
    });
    it('getUserById returns null when not found', async () => {
        jest.spyOn(user_model_1.User, 'findByPk').mockResolvedValue(null);
        const result = await userService.getUserById(999);
        expect(result).toBeNull();
    });
    it('getUserByEmail finds user by email', async () => {
        const mockUser = { idUser: 4, email: 'diana@test.com' };
        jest.spyOn(user_model_1.User, 'findOne').mockResolvedValue(mockUser);
        const result = await userService.getUserByEmail('diana@test.com');
        expect(user_model_1.User.findOne).toHaveBeenCalledWith({ where: { email: 'diana@test.com' } });
        expect(result).toBe(mockUser);
    });
    it('createUser creates new user', async () => {
        const payload = { name: 'Eve', email: 'eve@test.com', password: 'hashed', role: false };
        const mockUser = { idUser: 5, ...payload };
        jest.spyOn(user_model_1.User, 'create').mockResolvedValue(mockUser);
        const result = await userService.createUser(payload);
        expect(user_model_1.User.create).toHaveBeenCalledWith(payload);
        expect(result).toBe(mockUser);
    });
    it('updateUser updates existing user', async () => {
        const mockUser = { update: jest.fn().mockResolvedValue({ idUser: 6, name: 'Frank' }), idUser: 6 };
        jest.spyOn(user_model_1.User, 'findByPk').mockResolvedValue(mockUser);
        const data = { name: 'Frank' };
        const result = await userService.updateUser(6, data);
        expect(user_model_1.User.findByPk).toHaveBeenCalledWith(6);
        expect(mockUser.update).toHaveBeenCalledWith(data);
        expect(result).toHaveProperty('idUser');
    });
    it('updateUser returns null when user not found', async () => {
        jest.spyOn(user_model_1.User, 'findByPk').mockResolvedValue(null);
        const result = await userService.updateUser(999, {});
        expect(result).toBeNull();
    });
    it('deleteUser deletes user and returns true', async () => {
        jest.spyOn(user_model_1.User, 'destroy').mockResolvedValue(1);
        const result = await userService.deleteUser(7);
        expect(user_model_1.User.destroy).toHaveBeenCalledWith({ where: { idUser: 7 } });
        expect(result).toBe(true);
    });
    it('deleteUser returns false when user not found', async () => {
        jest.spyOn(user_model_1.User, 'destroy').mockResolvedValue(0);
        const result = await userService.deleteUser(999);
        expect(result).toBe(false);
    });
});
//# sourceMappingURL=user.services.test.js.map