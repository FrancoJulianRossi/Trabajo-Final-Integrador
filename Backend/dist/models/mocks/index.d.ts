import MoviesModel from "./movie.models";
import { rooms } from "./room.models";
import { screeningMock, screeningMockUpdated } from "./screening.models";
import ReservationMock from "./reservation.models";
import { seats } from "./seat.model";
import UserMock from "./user.models";
export { MoviesModel, rooms, screeningMock, screeningMockUpdated, ReservationMock, seats, UserMock, };
declare const _default: {
    MoviesModel: import("./movie.models").MoviesModel;
    rooms: import("./entities/room.entity").Room[];
    screeningMock: import("./entities/screening.entity").ScreeningEntity;
    screeningMockUpdated: import("./entities/screening.entity").ScreeningEntity;
    ReservationMock: import("./reservation.models").ReservationMock;
    seats: import("./entities/seat.entity").seat[];
    UserMock: import("./user.models").UserMock;
};
export default _default;
//# sourceMappingURL=index.d.ts.map