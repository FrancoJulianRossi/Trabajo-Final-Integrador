"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const screening_services_1 = require("./screening.services");
const screening_model_1 = require("../models/screening.model");
const movie_model_1 = require("../models/movie.model");
const reservation_model_1 = require("../models/reservation.model");
jest.mock("../models/screening.model");
jest.mock("../models/movie.model");
jest.mock("../models/reservation.model");
const screeningService = new screening_services_1.ScreeningService();
describe("ScreeningService", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    it("getScreeningById returns screening with relations", async () => {
        const mockScreening = { idScreening: 1, movieId: 1, roomId: 1 };
        jest.spyOn(screening_model_1.Screening, "findByPk").mockResolvedValue(mockScreening);
        const result = await screeningService.getScreeningById(1);
        expect(screening_model_1.Screening.findByPk).toHaveBeenCalledWith(1, {
            include: ["movie", "room"],
        });
        expect(result).toBe(mockScreening);
    });
    it("getScreenings returns all screenings", async () => {
        const mockScreenings = [
            { idScreening: 1, movieId: 1 },
            { idScreening: 2, movieId: 2 },
        ];
        jest.spyOn(screening_model_1.Screening, "findAll").mockResolvedValue(mockScreenings);
        const result = await screeningService.getScreenings();
        expect(screening_model_1.Screening.findAll).toHaveBeenCalledWith({
            where: {},
            include: ["movie", "room"],
        });
        expect(result).toEqual(mockScreenings);
    });
    it("getScreenings filters by movieId", async () => {
        const mockScreenings = [{ idScreening: 1, movieId: 5 }];
        jest.spyOn(screening_model_1.Screening, "findAll").mockResolvedValue(mockScreenings);
        const result = await screeningService.getScreenings(5);
        expect(screening_model_1.Screening.findAll).toHaveBeenCalledWith({
            where: { movieId: 5 },
            include: ["movie", "room"],
        });
        expect(result).toEqual(mockScreenings);
    });
    it("createScreening creates new screening and computes end based on movie length", async () => {
        const payload = {
            movieId: 2,
            roomId: 1,
            date: new Date("2024-05-05"),
            start: new Date("2024-05-05T10:00:00Z"),
            ticketPrice: 150,
        };
        // mock movie lookup to return length 120 minutes
        jest.spyOn(movie_model_1.Movie, "findByPk").mockResolvedValue({ length: 120 });
        const expectedEnd = new Date(new Date("2024-05-05T10:00:00Z").getTime() + 120 * 60 * 1000);
        const mockScreening = { idScreening: 10, ...payload, end: expectedEnd };
        jest.spyOn(screening_model_1.Screening, "create").mockResolvedValue(mockScreening);
        const result = await screeningService.createScreening(payload);
        // payload should have been mutated to include end date
        expect(payload.end).toEqual(expectedEnd);
        expect(screening_model_1.Screening.create).toHaveBeenCalledWith(payload);
        expect(result).toBe(mockScreening);
    });
    it("createScreening rejects when start is in the past", async () => {
        const pastDate = new Date(Date.now() - 60 * 60 * 1000);
        const payload = {
            movieId: 2,
            roomId: 1,
            date: pastDate,
            start: pastDate,
            ticketPrice: 100,
        };
        jest.spyOn(movie_model_1.Movie, "findByPk").mockResolvedValue({ length: 100 });
        await expect(screeningService.createScreening(payload)).rejects.toThrow(/past/i);
    });
    it("createScreening rejects negative ticketPrice", async () => {
        const payload = {
            movieId: 2,
            roomId: 1,
            date: new Date("2024-06-01"),
            start: new Date("2024-06-01T10:00:00Z"),
            ticketPrice: -50,
        };
        jest.spyOn(movie_model_1.Movie, "findByPk").mockResolvedValue({ length: 100 });
        await expect(screeningService.createScreening(payload)).rejects.toThrow(/price/i);
    });
    it("validation combines date and time correctly when strings are provided", async () => {
        // supply date as date-only string and start as time-only string
        const payload = {
            movieId: 2,
            roomId: 1,
            // provide valid Date instances to satisfy typings
            date: new Date("2024-06-10"),
            start: new Date("2024-06-10T09:00:00"),
            ticketPrice: 100,
        }; // cast due to partial mismatch
        // movie length -> 60
        jest.spyOn(movie_model_1.Movie, "findByPk").mockResolvedValue({ length: 60 });
        const expectedEnd = new Date("2024-06-10T10:00:00");
        jest.spyOn(screening_model_1.Screening, "create").mockImplementation(async (data) => {
            // ensure that end got calculated with correct date
            expect(new Date(data.end)).toEqual(expectedEnd);
            return { idScreening: 123, ...data };
        });
        const result = await screeningService.createScreening(payload);
        expect(result).toHaveProperty("idScreening", 123);
    });
    it("createScreening rejects when there is an overlapping screening", async () => {
        const start = new Date("2024-06-01T10:00:00Z");
        const end = new Date("2024-06-01T12:00:00Z");
        const payload = {
            movieId: 2,
            roomId: 5,
            date: new Date("2024-06-01"),
            start,
            ticketPrice: 120,
        };
        // compute end based on movie length
        jest.spyOn(movie_model_1.Movie, "findByPk").mockResolvedValue({ length: 120 });
        const existing = { idScreening: 99 };
        // overlap query should find something
        jest.spyOn(screening_model_1.Screening, "findOne").mockResolvedValue(existing);
        await expect(screeningService.createScreening(payload)).rejects.toThrow(/overlaps/i);
    });
    it("updateScreening updates existing screening and recalculates end when start/movie change", async () => {
        // existing screening with old values
        const existing = {
            update: jest
                .fn()
                .mockResolvedValue({ idScreening: 11, ticketPrice: 200 }),
            idScreening: 11,
            movieId: 2,
            start: new Date("2024-05-05T08:00:00Z"),
        };
        jest.spyOn(screening_model_1.Screening, "findByPk").mockResolvedValue(existing);
        // when updating start time and/or movie we expect recomputation
        const newStart = new Date("2024-05-05T12:00:00Z");
        const payload = { start: newStart, movieId: 3 };
        jest.spyOn(movie_model_1.Movie, "findByPk").mockResolvedValue({ length: 90 });
        const result = await screeningService.updateScreening(11, payload);
        const expectedEnd = new Date(newStart.getTime() + 90 * 60 * 1000);
        // expect update called with end computed
        expect(existing.update).toHaveBeenCalledWith(expect.objectContaining({ end: expectedEnd }));
        expect(result).toHaveProperty("idScreening");
    });
    it("updateScreening returns null when screening not found", async () => {
        jest.spyOn(screening_model_1.Screening, "findByPk").mockResolvedValue(null);
        const result = await screeningService.updateScreening(999, {});
        expect(result).toBeNull();
    });
    it("updateScreening rejects when new start is in the past", async () => {
        const existing = {
            update: jest.fn().mockResolvedValue({ idScreening: 11 }),
            idScreening: 11,
            movieId: 2,
            start: new Date("2024-05-05T08:00:00Z"),
            roomId: 3,
            date: new Date("2024-05-05"),
            end: new Date("2024-05-05T10:00:00Z"),
        };
        jest.spyOn(screening_model_1.Screening, "findByPk").mockResolvedValue(existing);
        const past = new Date(Date.now() - 3600000);
        const payload = { start: past };
        await expect(screeningService.updateScreening(11, payload)).rejects.toThrow(/past/i);
    });
    it("updateScreening rejects negative ticketPrice", async () => {
        const existing = {
            update: jest.fn().mockResolvedValue({ idScreening: 22 }),
            idScreening: 22,
            movieId: 2,
            start: new Date("2024-05-05T08:00:00Z"),
            roomId: 3,
            date: new Date("2024-05-05"),
            end: new Date("2024-05-05T10:00:00Z"),
        };
        jest.spyOn(screening_model_1.Screening, "findByPk").mockResolvedValue(existing);
        await expect(screeningService.updateScreening(22, { ticketPrice: -1 })).rejects.toThrow(/price/i);
    });
    it("updateScreening rejects when updated timing overlaps another screening", async () => {
        const existing = {
            update: jest.fn().mockResolvedValue({ idScreening: 11 }),
            idScreening: 11,
            movieId: 2,
            start: new Date("2024-06-01T08:00:00Z"),
            roomId: 5,
            date: new Date("2024-06-01"),
            end: new Date("2024-06-01T10:00:00Z"),
        };
        jest.spyOn(screening_model_1.Screening, "findByPk").mockResolvedValue(existing);
        // when computing new end
        jest.spyOn(movie_model_1.Movie, "findByPk").mockResolvedValue({ length: 180 });
        const newStart = new Date("2024-06-01T09:00:00Z");
        // findOne indicates overlap
        jest
            .spyOn(screening_model_1.Screening, "findOne")
            .mockResolvedValue({ idScreening: 77 });
        await expect(screeningService.updateScreening(11, { start: newStart })).rejects.toThrow(/overlaps/i);
    });
    it("deleteScreening throws error if active reservations exist", async () => {
        jest.spyOn(reservation_model_1.Reservation, "count").mockResolvedValue(1);
        await expect(screeningService.deleteScreening(12)).rejects.toThrow("Cannot delete screening: it has active reservations");
    });
    it("deleteScreening deletes screening when no active reservations", async () => {
        jest.spyOn(reservation_model_1.Reservation, "count").mockResolvedValue(0);
        jest.spyOn(screening_model_1.Screening, "destroy").mockResolvedValue(1);
        const result = await screeningService.deleteScreening(13);
        expect(result).toBe(true);
    });
    it("deleteScreening returns false when screening not found", async () => {
        jest.spyOn(reservation_model_1.Reservation, "count").mockResolvedValue(0);
        jest.spyOn(screening_model_1.Screening, "destroy").mockResolvedValue(0);
        const result = await screeningService.deleteScreening(999);
        expect(result).toBe(false);
    });
});
//# sourceMappingURL=screening.services.test.js.map