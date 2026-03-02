"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const movie_services_1 = __importDefault(require("../services/movie.services"));
// bypass authentication middleware during tests
jest.mock('../middleware/auth.middleware', () => ({
    authenticate: (req, res, next) => next(),
    requireAdmin: (req, res, next) => next(),
}));
jest.mock('../services/movie.services');
const mockedService = movie_services_1.default;
describe('MoviesController routes', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('GET /api/movies should return list', async () => {
        mockedService.list.mockResolvedValue([{ idMovie: 1, name: 'X' }]);
        const res = await (0, supertest_1.default)(app_1.default).get('/api/movies');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ idMovie: 1, name: 'X' }]);
    });
    it('GET /api/movies/:id returns movie or 404', async () => {
        mockedService.getById.mockResolvedValue({ idMovie: 2, name: 'Y' });
        let res = await (0, supertest_1.default)(app_1.default).get('/api/movies/2');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ idMovie: 2, name: 'Y' });
        mockedService.getById.mockRejectedValue(new Error('not found'));
        res = await (0, supertest_1.default)(app_1.default).get('/api/movies/999');
        expect(res.status).toBe(404);
    });
    it('POST /api/movies creates', async () => {
        const payload = { name: 'New' };
        mockedService.create.mockResolvedValue({ idMovie: 5, ...payload });
        const res = await (0, supertest_1.default)(app_1.default).post('/api/movies').send(payload);
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ idMovie: 5, ...payload });
    });
    it('PUT /api/movies/:id updates', async () => {
        const payload = { name: 'Updated' };
        mockedService.update.mockResolvedValue({ idMovie: 6, ...payload });
        const res = await (0, supertest_1.default)(app_1.default).put('/api/movies/6').send(payload);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ idMovie: 6, ...payload });
    });
    it('DELETE /api/movies/:id deletes', async () => {
        mockedService.delete.mockResolvedValue();
        const res = await (0, supertest_1.default)(app_1.default).delete('/api/movies/7');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Movie deleted' });
    });
});
//# sourceMappingURL=movie.controller.test.js.map