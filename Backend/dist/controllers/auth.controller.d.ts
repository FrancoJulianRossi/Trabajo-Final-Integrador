import { Request, Response } from "express";
export declare class AuthController {
    private userService;
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * initiate password reset by email
     * returns a token (in real app would email the link)
     */
    forgotPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * complete password reset using token
     */
    resetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: AuthController;
export default _default;
//# sourceMappingURL=auth.controller.d.ts.map