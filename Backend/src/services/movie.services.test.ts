import movieService, { MovieService } from './movie.services';
import { Movie } from '../models/movie.model';

// we will mock the Movie model methods used by the service

describe('MovieService', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('list should call Movie.findAll and return result', async () => {
        const mockMovies = [{ idMovie: 1, name: 'A' }] as any;
        jest.spyOn(Movie, 'findAll').mockResolvedValue(mockMovies);
        const result = await movieService.list();
        expect(Movie.findAll).toHaveBeenCalled();
        expect(result).toBe(mockMovies);
    });

    it('getById should return movie when found', async () => {
        const m = { idMovie: 2, name: 'B' } as any;
        jest.spyOn(Movie, 'findByPk').mockResolvedValue(m);
        const result = await movieService.getById(2);
        expect(Movie.findByPk).toHaveBeenCalledWith(2);
        expect(result).toBe(m);
    });

    it('getById should throw when not found', async () => {
        jest.spyOn(Movie, 'findByPk').mockResolvedValue(null);
        await expect(movieService.getById(5)).rejects.toThrow('Movie not found');
    });

    it('create should call Movie.create and return the new record', async () => {
        const payload = { name: 'New' } as any;
        const created = { idMovie: 3, ...payload } as any;
        jest.spyOn(Movie, 'create').mockResolvedValue(created);
        const res = await movieService.create(payload);
        expect(Movie.create).toHaveBeenCalledWith(payload);
        expect(res).toBe(created);
    });

    it('update should update existing movie', async () => {
        const movieInstance: any = {
            update: jest.fn().mockResolvedValue(undefined),
        };
        jest.spyOn(Movie, 'findByPk').mockResolvedValue(movieInstance);
        const data = { name: 'updated' } as any;
        const res = await movieService.update(7, data);
        expect(Movie.findByPk).toHaveBeenCalledWith(7);
        expect(movieInstance.update).toHaveBeenCalledWith(data);
        expect(res).toBe(movieInstance);
    });

    it('update throws if movie not found', async () => {
        jest.spyOn(Movie, 'findByPk').mockResolvedValue(null);
        await expect(movieService.update(8, {} as any)).rejects.toThrow('Movie not found');
    });

    it('delete should destroy record', async () => {
        const movieInstance: any = {
            destroy: jest.fn().mockResolvedValue(undefined),
        };
        jest.spyOn(Movie, 'findByPk').mockResolvedValue(movieInstance);
        await movieService.delete(9);
        expect(Movie.findByPk).toHaveBeenCalledWith(9);
        expect(movieInstance.destroy).toHaveBeenCalled();
    });

    it('delete throws when not found', async () => {
        jest.spyOn(Movie, 'findByPk').mockResolvedValue(null);
        await expect(movieService.delete(10)).rejects.toThrow('Movie not found');
    });

    it('create should reject negative or zero length', async () => {
        const payload = { name: 'Bad Movie', length: -10 } as any;
        await expect(movieService.create(payload)).rejects.toThrow(/positive/i);

        const payload2 = { name: 'Also bad', length: 0 } as any;
        await expect(movieService.create(payload2)).rejects.toThrow(/positive/i);
    });

    it('update should reject negative or zero length', async () => {
        const movieInstance: any = {
            update: jest.fn().mockResolvedValue(undefined),
        };
        jest.spyOn(Movie, 'findByPk').mockResolvedValue(movieInstance);
        await expect(movieService.update(1, { length: -5 } as any)).rejects.toThrow(/positive/i);
        await expect(movieService.update(1, { length: 0 } as any)).rejects.toThrow(/positive/i);
    });
});