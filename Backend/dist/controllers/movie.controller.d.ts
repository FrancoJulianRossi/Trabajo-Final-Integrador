import { Request, Response } from "express";
declare class MoviesController {
    list(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: MoviesController;
export default _default;
//# sourceMappingURL=movie.controller.d.ts.map