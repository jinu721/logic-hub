import { NextFunction, Request, Response } from "express";

export interface INotificationController {
  createNotification(req: Request, res: Response,next: NextFunction): Promise<void>;
  getAllNotifications(req: Request, res: Response,next: NextFunction): Promise<void>;
  getNotificationById(req: Request, res: Response,next: NextFunction): Promise<void>;
  updateNotification(req: Request, res: Response,next: NextFunction): Promise<void>;
  deleteNotification(req: Request, res: Response,next: NextFunction): Promise<void>;
  getNotificationByUser(req: Request, res: Response,next: NextFunction): Promise<void>;
  markAllAsRead(req: Request, res: Response,next: NextFunction): Promise<void>;
  deleteAllNotifications(req: Request, res: Response,next: NextFunction): Promise<void>;
}
