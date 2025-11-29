import { Request, Response } from "express";
export declare class ReservationController {
    private reservationService;
    constructor();
    listHandler(req: Request, res: Response): Promise<void>;
    createHandler(req: Request, res: Response): Promise<void>;
}
export declare const reservationController: ReservationController;
export default ReservationController;
//# sourceMappingURL=reservation.controller.d.ts.map