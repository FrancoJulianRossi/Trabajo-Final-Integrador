import {
  createBooking,
  getBookings,
  getAllBookingsAdmin,
  updateBooking,
  deleteBooking,
} from './booking.controller';
import bookingService from '../services/booking.services';

// simple mock Request/Response helpers
function mockResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe('BookingController', () => {
  afterEach(() => jest.resetAllMocks());

  describe('createBooking', () => {
    it('uses authenticated user id when not admin', async () => {
      const req: any = {
        body: { screening: { idScreening: 1 }, seats: [] },
        user: { idUser: 5, role: 'client' },
      };
      const res = mockResponse();
      jest
        .spyOn(bookingService, 'createReservation')
        .mockResolvedValue({ idReservation: 10 } as any);

      await createBooking(req, res);

      expect(bookingService.createReservation).toHaveBeenCalledWith(
        1,
        5,
        [],
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('allows admin to specify userId', async () => {
      const req: any = {
        body: { screening: { idScreening: 2 }, seats: [], userId: 99 },
        user: { idUser: 1, role: 'admin' },
      };
      const res = mockResponse();
      jest
        .spyOn(bookingService, 'createReservation')
        .mockResolvedValue({ idReservation: 20 } as any);

      await createBooking(req, res);

      expect(bookingService.createReservation).toHaveBeenCalledWith(
        2,
        99,
        [],
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('returns 400 if missing data', async () => {
      const req: any = { body: {}, user: { idUser: 1 } };
      const res = mockResponse();
      await createBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
