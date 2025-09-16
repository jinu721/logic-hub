import { NextFunction, Request, Response } from "express";

export interface IConversationController {
  findOneToOne(req: Request, res: Response, next: NextFunction): Promise<void>;
  findConversation(req: Request, res: Response, next: NextFunction): Promise<void>;
  createOneToOne(req: Request, res: Response, next: NextFunction): Promise<void>;
  setTypingUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  removeTypingUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTypingUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  findConversationByGroup(req: Request, res: Response, next: NextFunction): Promise<void>;
  findConversationByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}
