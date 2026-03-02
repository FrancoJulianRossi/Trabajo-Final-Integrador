import request from 'supertest';
import app from '../app';
import movieService from '../services/movie.services';

// bypass authentication middleware during tests
jest.mock('../middleware/auth.middleware', () => ({
    authenticate: (req: any, res: any, next: any) => next(),
    requireAdmin: (req: any, res: any, next: any) => next(),
}));

jest.mock('../services/movie.services');

const mockedService = movieService as jest.Mocked<typeof movieService>;

describe('MoviesController routes', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('GET /api/movies should return list', async () => {
        mockedService.list.mockResolvedValue([{ idMovie: 1, name: 'X' }] as any);
        const res = await request(app).get('/api/movies');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ idMovie: 1, name: 'X' }]);
    });

    it('GET /api/movies/:id returns movie or 404', async () => {
        mockedService.getById.mockResolvedValue({ idMovie: 2, name: 'Y' } as any);
        let res = await request(app).get('/api/movies/2');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ idMovie: 2, name: 'Y' });

        mockedService.getById.mockRejectedValue(new Error('not found'));
        res = await request(app).get('/api/movies/999');
        expect(res.status).toBe(404);
    });

    it('POST /api/movies creates', async () => {
        const payload = { name: 'New' };
        mockedService.create.mockResolvedValue({ idMovie: 5, ...payload } as any);
        const res = await request(app).post('/api/movies').send(payload);
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ idMovie: 5, ...payload });
    });

    it('PUT /api/movies/:id updates', async () => {
        const payload = { name: 'Updated' };
        mockedService.update.mockResolvedValue({ idMovie: 6, ...payload } as any);
        const res = await request(app).put('/api/movies/6').send(payload);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ idMovie: 6, ...payload });
    });

    it('DELETE /api/movies/:id deletes', async () => {
        mockedService.delete.mockResolvedValue();
        const res = await request(app).delete('/api/movies/7');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Movie deleted' });
    });
});