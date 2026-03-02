import { Request, Response } from "express";
export declare class UserController {
    private userService;
    constructor();
    getUsers(req: Request, res: Response): Promise<Response>;
    createUser(req: Request, res: Response): Promise<Response>;
    updateUser(req: Request, res: Response): Promise<Response>;
    deleteUser(req: Request, res: Response): Promise<Response>;
    getProfile(req: any, res: Response): Promise<Response>;
    updateProfile(req: any, res: Response): Promise<Response>;
}
//# sourceMappingURL=user.controller.d.ts.map