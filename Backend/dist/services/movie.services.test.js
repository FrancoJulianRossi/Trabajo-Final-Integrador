"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const movie_services_1 = __importDefault(require("./movie.services"));
const movie_model_1 = require("../models/movie.model");
// we will mock the Movie model methods used by the service
describe('MovieService', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('list should call Movie.findAll and return result', async () => {
        const mockMovies = [{ idMovie: 1, name: 'A' }];
        jest.spyOn(movie_model_1.Movie, 'findAll').mockResolvedValue(mockMovies);
        const result = await movie_services_1.default.list();
        expect(movie_model_1.Movie.findAll).toHaveBeenCalled();
        expect(result).toBe(mockMovies);
    });
    it('getById should return movie when found', async () => {
        const m = { idMovie: 2, name: 'B' };
        jest.spyOn(movie_model_1.Movie, 'findByPk').mockResolvedValue(m);
        const result = await movie_services_1.default.getById(2);
        expect(movie_model_1.Movie.findByPk).toHaveBeenCalledWith(2);
        expect(result).toBe(m);
    });
    it('getById should throw when not found', async () => {
        jest.spyOn(movie_model_1.Movie, 'findByPk').mockResolvedValue(null);
        await expect(movie_services_1.default.getById(5)).rejects.toThrow('Movie not found');
    });
    it('create should call Movie.create and return the new record', async () => {
        const payload = { name: 'New' };
        const created = { idMovie: 3, ...payload };
        jest.spyOn(movie_model_1.Movie, 'create').mockResolvedValue(created);
        const res = await movie_services_1.default.create(payload);
        expect(movie_model_1.Movie.create).toHaveBeenCalledWith(payload);
        expect(res).toBe(created);
    });
    it('update should update existing movie', async () => {
        const movieInstance = {
            update: jest.fn().mockResolvedValue(undefined),
        };
        jest.spyOn(movie_model_1.Movie, 'findByPk').mockResolvedValue(movieInstance);
        const data = { name: 'updated' };
        const res = await movie_services_1.default.update(7, data);
        expect(movie_model_1.Movie.findByPk).toHaveBeenCalledWith(7);
        expect(movieInstance.update).toHaveBeenCalledWith(data);
        expect(res).toBe(movieInstance);
    });
    it('update throws if movie not found', async () => {
        jest.spyOn(movie_model_1.Movie, 'findByPk').mockResolvedValue(null);
        await expect(movie_services_1.default.update(8, {})).rejects.toThrow('Movie not found');
    });
    it('delete should destroy record', async () => {
        const movieInstance = {
            destroy: jest.fn().mockResolvedValue(undefined),
        };
        jest.spyOn(movie_model_1.Movie, 'findByPk').mockResolvedValue(movieInstance);
        await movie_services_1.default.delete(9);
        expect(movie_model_1.Movie.findByPk).toHaveBeenCalledWith(9);
        expect(movieInstance.destroy).toHaveBeenCalled();
    });
    it('delete throws when not found', async () => {
        jest.spyOn(movie_model_1.Movie, 'findByPk').mockResolvedValue(null);
        await expect(movie_services_1.default.delete(10)).rejects.toThrow('Movie not found');
    });
});
//# sourceMappingURL=movie.services.test.js.map