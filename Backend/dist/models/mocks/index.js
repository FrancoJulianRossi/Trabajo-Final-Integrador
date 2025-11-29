"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMock = exports.seats = exports.ReservationMock = exports.screeningMockUpdated = exports.screeningMock = exports.rooms = exports.MoviesModel = void 0;
const movie_models_1 = __importDefault(require("./movie.models"));
exports.MoviesModel = movie_models_1.default;
const room_models_1 = require("./room.models");
Object.defineProperty(exports, "rooms", { enumerable: true, get: function () { return room_models_1.rooms; } });
const screening_models_1 = require("./screening.models");
Object.defineProperty(exports, "screeningMock", { enumerable: true, get: function () { return screening_models_1.screeningMock; } });
Object.defineProperty(exports, "screeningMockUpdated", { enumerable: true, get: function () { return screening_models_1.screeningMockUpdated; } });
const reservation_models_1 = __importDefault(require("./reservation.models"));
exports.ReservationMock = reservation_models_1.default;
const seat_model_1 = require("./seat.model");
Object.defineProperty(exports, "seats", { enumerable: true, get: function () { return seat_model_1.seats; } });
const user_models_1 = __importDefault(require("./user.models"));
exports.UserMock = user_models_1.default;
exports.default = {
    MoviesModel: movie_models_1.default,
    rooms: room_models_1.rooms,
    screeningMock: screening_models_1.screeningMock,
    screeningMockUpdated: screening_models_1.screeningMockUpdated,
    ReservationMock: reservation_models_1.default,
    seats: seat_model_1.seats,
    UserMock: user_models_1.default,
};
//# sourceMappingURL=index.js.map