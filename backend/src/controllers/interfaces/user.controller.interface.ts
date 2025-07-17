import { Request, Response } from "express";

export interface IUserController {
    findUser(req:Request,res:Response):Promise<void>;
    getCurrentUser(req:Request,res:Response):Promise<void>;
    updateCurrentUser(req:Request,res:Response):Promise<void>;
    getUsers(req:Request,res:Response):Promise<void>;
    getUser(req:Request,res:Response):Promise<void>;
    giftItem(req: Request, res: Response): Promise<void>;
    cancelMembership(req: Request, res: Response): Promise<void>;
    toggleBan(req: Request, res: Response): Promise<void>;
    resendOtp(req: Request, res: Response): Promise<void>;
    claimDailyReward(req: Request, res: Response): Promise<void>;
    verifyAdmin(req: Request, res: Response): Promise<void>;
}
