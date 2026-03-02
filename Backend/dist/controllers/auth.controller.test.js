"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const user_services_1 = require("../services/user.services");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock("../services/user.services");
const mockedUserService = user_services_1.UserService;
describe("AuthController routes", () => {
    beforeEach(() => {
        mockedUserService.prototype.getUserByEmail.mockClear();
        mockedUserService.prototype.createUser.mockClear();
        mockedUserService.prototype.getUserById.mockClear?.();
        mockedUserService.prototype.updateUser.mockClear?.();
    });
    it("POST /api/auth/register fails when missing fields", async () => {
        const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/register").send({});
        expect(res.status).toBe(400);
    });
    it("POST /api/auth/register returns 409 if email exists", async () => {
        mockedUserService.prototype.getUserByEmail.mockResolvedValue({
            idUser: 1,
            email: "a",
        });
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/register")
            .send({ name: "x", email: "a", password: "p" });
        expect(res.status).toBe(409);
    });
    it("POST /api/auth/register success", async () => {
        mockedUserService.prototype.getUserByEmail.mockResolvedValue(null);
        mockedUserService.prototype.createUser.mockResolvedValue({
            idUser: 2,
            email: "b",
        });
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/register")
            .send({ name: "x", email: "b", password: "p" });
        expect(res.status).toBe(201);
    });
    it("POST /api/auth/login handles missing fields", async () => {
        let res = await (0, supertest_1.default)(app_1.default).post("/api/auth/login").send({});
        expect(res.status).toBe(400);
        mockedUserService.prototype.getUserByEmail.mockResolvedValue(null);
        res = await (0, supertest_1.default)(app_1.default)
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
        };
        mockedUserService.prototype.getUserByEmail.mockResolvedValue(fakeUser);
        const compareSpy = jest.spyOn(bcryptjs_1.default, "compare");
        compareSpy.mockResolvedValue(true);
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({ email: "c", password: "p" });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body.user).toMatchObject({ idUser: 3, email: "c" });
    });
    describe("password recovery", () => {
        it("POST /api/auth/forgot-password requires email", async () => {
            const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/forgot-password").send({});
            expect(res.status).toBe(400);
        });
        it("POST /api/auth/forgot-password returns success even if user missing", async () => {
            mockedUserService.prototype.getUserByEmail.mockResolvedValue(null);
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/forgot-password")
                .send({ email: "noone@example.com" });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message");
        });
        it("POST /api/auth/forgot-password returns token when user exists", async () => {
            const fakeUser = { idUser: 5, email: "foo@example.com" };
            mockedUserService.prototype.getUserByEmail.mockResolvedValue(fakeUser);
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/forgot-password")
                .send({ email: "foo@example.com" });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("token");
            // verify token decodable
            const payload = jsonwebtoken_1.default.verify(res.body.token, process.env.JWT_SECRET || "change_this_secret");
            expect(payload.idUser).toBe(5);
        });
        it("POST /api/auth/reset-password checks fields", async () => {
            let res = await (0, supertest_1.default)(app_1.default).post("/api/auth/reset-password").send({});
            expect(res.status).toBe(400);
        });
        it("POST /api/auth/reset-password rejects invalid token", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/reset-password")
                .send({ token: "bad", newPassword: "123" });
            expect(res.status).toBe(400);
        });
        it("POST /api/auth/reset-password works with valid token", async () => {
            const fakeUser = {
                idUser: 7,
                email: "bar@example.com",
                password: "x",
            };
            mockedUserService.prototype.getUserById.mockResolvedValue(fakeUser);
            const updateSpy = mockedUserService.prototype.updateUser;
            const token = jsonwebtoken_1.default.sign({ idUser: 7 }, process.env.JWT_SECRET || "change_this_secret", { expiresIn: "1h" });
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/reset-password")
                .send({ token, newPassword: "newpass" });
            expect(res.status).toBe(200);
            expect(updateSpy).toHaveBeenCalledWith(7, expect.objectContaining({ password: expect.any(String) }));
        });
    });
});
//# sourceMappingURL=auth.controller.test.js.map