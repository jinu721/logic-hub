import { Request, Response } from "express";

export interface IMessageController {
  getMessages(req: Request, res: Response): Promise<void>;
  editMessage(req: Request, res: Response): Promise<void>;
  deleteMessage(req: Request, res: Response): Promise<void>;
  addReaction(req: Request, res: Response): Promise<void>;
  removeReaction(req: Request, res: Response): Promise<void>;
  markAsSeen(req: Request, res: Response): Promise<void>;
  getMessageById(req: Request, res: Response): Promise<void>;
  uploadMessage(req: Request, res: Response): Promise<void>;
}
