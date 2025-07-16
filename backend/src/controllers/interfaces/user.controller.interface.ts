import { Request, Response } from "express";

export interface IUserController {
    findUser(req:Request,res:Response):Promise<void>;
    getCurrentUser(req:Request,res:Response):Promise<void>;
    updateCurrentUser(req:Request,res:Response):Promise<void>;
    getUsers(req:Request,res:Response):Promise<void>;
    getUser(req:Request,res:Response):Promise<void>;
    giftItem(req: Request, res: Response): Promise<void>;
}
