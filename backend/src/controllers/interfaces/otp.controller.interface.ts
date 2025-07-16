import { Request, Response } from "express";

export interface IUserController {
    register(req: Request, res: Response): Promise<void>;
    verifyOTP(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    refreshToken(req: Request, res: Response): void;
    googleAuth(req: Request, res: Response): void;
    githubAuth(req: Request, res: Response): void;
    // forgotPassword(req:Request,res:Response):void;
}
