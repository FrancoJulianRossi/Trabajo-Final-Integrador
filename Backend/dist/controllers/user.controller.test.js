"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const user_services_1 = require("../services/user.services");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// stub authentication middleware so requests look authenticated and carry an idUser
jest.mock("../middleware/auth.middleware", () => ({
    authenticate: (req, res, next) => {
        req.user = { idUser: 42 };
        next();
    },
    requireAdmin: (req, res, next) => next(),
}));
jest.mock("../services/user.services");
const mockedUserService = user_services_1.UserService;
describe("UserController profile routes", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it("GET /api/users/me returns current user without password", async () => {
        const fakeUser = {
            idUser: 42,
            name: "Test",
            email: "t@example.com",
            password: "secret",
        };
        mockedUserService.prototype.getUserById.mockResolvedValue(fakeUser);
        const res = await (0, supertest_1.default)(app_1.default).get("/api/users/me");
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
        const fakeUser = {
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
        };
        mockedUserService.prototype.updateUser.mockResolvedValue(updated);
        const res = await (0, supertest_1.default)(app_1.default)
            .put("/api/users/me")
            .send({ name: "New", email: "new@x.com" });
        expect(res.status).toBe(200);
        expect(res.body).toEqual(updated);
    });
    it("PUT /api/users/me changing password without currentPassword fails", async () => {
        const fakeUser = { idUser: 42, password: "hash" };
        mockedUserService.prototype.getUserById.mockResolvedValue(fakeUser);
        const res = await (0, supertest_1.default)(app_1.default)
            .put("/api/users/me")
            .send({ password: "newpass" });
        expect(res.status).toBe(400);
    });
    it("PUT /api/users/me with wrong currentPassword returns 401", async () => {
        const fakeUser = { idUser: 42, password: "hash" };
        mockedUserService.prototype.getUserById.mockResolvedValue(fakeUser);
        const compareSpy = jest.spyOn(bcryptjs_1.default, "compare");
        compareSpy.mockResolvedValue(false);
        const res = await (0, supertest_1.default)(app_1.default)
            .put("/api/users/me")
            .send({ password: "newpass", currentPassword: "wrong" });
        expect(res.status).toBe(401);
    });
    it("PUT /api/users/me with correct currentPassword updates and hashes", async () => {
        const fakeUser = { idUser: 42, password: "hash", role: false };
        mockedUserService.prototype.getUserById.mockResolvedValue(fakeUser);
        const compareSpy = jest.spyOn(bcryptjs_1.default, "compare");
        compareSpy.mockResolvedValue(true);
        const hashSpy = jest.spyOn(bcryptjs_1.default, "hash");
        hashSpy.mockResolvedValue("newhash");
        mockedUserService.prototype.updateUser.mockResolvedValue({
            idUser: 42,
            name: "X",
            email: "x@x.com",
            role: false,
        });
        const res = await (0, supertest_1.default)(app_1.default)
            .put("/api/users/me")
            .send({ password: "newpass", currentPassword: "oldpass" });
        expect(res.status).toBe(200);
        expect(hashSpy).toHaveBeenCalledWith("newpass", 10);
    });
});
//# sourceMappingURL=user.controller.test.js.map