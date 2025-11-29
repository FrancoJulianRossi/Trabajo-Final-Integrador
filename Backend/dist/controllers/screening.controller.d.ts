import { Request, Response } from "express";
export declare class ScreeningController {
    private screeningService;
    constructor();
    getAllScreenings(req: Request, res: Response): Promise<Response>;
    getScreeningById(req: Request, res: Response): Promise<Response>;
    createScreening(req: Request, res: Response): Promise<Response>;
    getSeatsForScreening(req: Request, res: Response): Promise<Response>;
    updateScreening(req: Request, res: Response): Promise<Response>;
    deleteScreening(req: Request, res: Response): Promise<Response>;
}
//# sourceMappingURL=screening.controller.d.ts.map