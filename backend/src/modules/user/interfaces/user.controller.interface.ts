import { NextFunction, Request, Response } from "express";

export interface IUserController {
    findUser(req:Request,res:Response,next: NextFunction):Promise<void>;
    getCurrentUser(req:Request,res:Response,next: NextFunction):Promise<void>;
    updateCurrentUser(req:Request,res:Response,next: NextFunction):Promise<void>;
    getUsers(req:Request,res:Response,next: NextFunction):Promise<void>;
    getUser(req:Request,res:Response,next: NextFunction):Promise<void>;
    giftItem(req: Request, res: Response,next: NextFunction): Promise<void>;
    cancelMembership(req: Request, res: Response,next: NextFunction): Promise<void>;
    toggleBan(req: Request, res: Response,next: NextFunction): Promise<void>;
    // resendOtp(req: Request, res: Response,next: NextFunction): Promise<void>;
    claimDailyReward(req: Request, res: Response,next: NextFunction): Promise<void>;
    verifyAdmin(req: Request, res: Response,next: NextFunction): Promise<void>;
    toggleUserNotification(req: Request, res: Response,next: NextFunction): Promise<void>;
    purchaseMarketItem(req: Request, res: Response, next: NextFunction): Promise<void>;
}
