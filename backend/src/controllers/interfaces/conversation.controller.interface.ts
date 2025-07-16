import { Request, Response } from "express";

export interface IConversationController {
  findOneToOne(req: Request, res: Response): Promise<void>;
  findConversation(req: Request, res: Response): Promise<void>;
  createOneToOne(req: Request, res: Response): Promise<void>;
  setTypingUser(req: Request, res: Response): Promise<void>;
  removeTypingUser(req: Request, res: Response): Promise<void>;
  getTypingUsers(req: Request, res: Response): Promise<void>;
  findConversationByGroup(req: Request, res: Response): Promise<void>;
}
