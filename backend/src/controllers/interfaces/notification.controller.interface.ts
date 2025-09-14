import { Request, Response } from "express";

export interface INotificationController {
  createNotification(req: Request, res: Response): Promise<void>;
  getAllNotifications(req: Request, res: Response): Promise<void>;
  getNotificationById(req: Request, res: Response): Promise<void>;
  updateNotification(req: Request, res: Response): Promise<void>;
  deleteNotification(req: Request, res: Response): Promise<void>;
  getNotificationByUser(req: Request, res: Response): Promise<void>;
  markAllAsRead(req: Request, res: Response): Promise<void>;
  deleteAllNotifications(req: Request, res: Response): Promise<void>;
  toggleUserNotification(req: Request, res: Response): Promise<void>;
}
