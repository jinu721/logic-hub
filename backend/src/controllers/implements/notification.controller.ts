import { Request, Response } from "express";
import { INotificationController } from "../interfaces/notification.controller.interface";
import { HttpStatus } from "../../constants/http.status";
import { NotificationService } from "../../services/implements/notification.service";
import { UserService } from "../../services/implements/user.service";

export class NotificationController implements INotificationController {
  constructor(private notificationService: NotificationService,private userService: UserService) {}

  async createNotification(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.notificationService.create(req.body);
      res.status(HttpStatus.CREATED).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create notification",
      });
    }
  }

  async getAllNotifications(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.notificationService.getAll();
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch notifications",
      });
    }
  }

  async getNotificationById(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.notificationService.getById(req.params.id);
      if (!result) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: "Notification not found" });
        return;
      }
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch notification",
      });
    }
  }

  async updateNotification(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.notificationService.update(
        req.params.id,
        req.body
      );
      if (!result) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: "Notification not found" });
        return;
      }
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update notification",
      });
    }
  }

  async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.notificationService.delete(req.params.id);
      if (!result) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: "Notification not found" });
        return;
      }
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Notification deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to delete notification",
      });
    }
  }

  async getNotificationByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const result =  await this.notificationService.getNotificationByUserId(
        userId
      );
      res.status(HttpStatus.OK).json(result);
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch notification",
      });
    }
  }

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const result = await this.notificationService.markAllAsRead(userId);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to mark all notifications as read",
      });
    }
  }
  async deleteAllNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

        const result = await this.notificationService.deleteAll(userId);
        res.status(HttpStatus.OK).json({ success: true, data: result });
      } catch (error) {
        console.log(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to mark all notifications as read",
        });
      }
  }
  async toggleUserNotification(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const result = await this.userService.toggleUserNotification(userId);
      res.status(HttpStatus.OK).json({ message: `Notification Toggle Successfully`, result });
    } catch (err: any) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
  }
}
