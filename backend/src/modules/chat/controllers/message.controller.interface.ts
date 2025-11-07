import { NextFunction, Request, Response } from "express";

export interface IMessageController {
  getMessages(req: Request, res: Response,next: NextFunction): Promise<void>;
  editMessage(req: Request, res: Response,next: NextFunction): Promise<void>;
  deleteMessage(req: Request, res: Response,next: NextFunction): Promise<void>;
  addReaction(req: Request, res: Response,next: NextFunction): Promise<void>;
  removeReaction(req: Request, res: Response,next: NextFunction): Promise<void>;
  markAsSeen(req: Request, res: Response,next: NextFunction): Promise<void>;
  getMessageById(req: Request, res: Response,next: NextFunction): Promise<void>;
  uploadMessage(req: Request, res: Response,next: NextFunction): Promise<void>;
}
