import { Request, Response } from "express";
import { INotificationController } from "../interfaces/notification.controller.interface";
import { HttpStatus } from "../../constants/http.status";
import { sendError, sendSuccess } from "../../utils/application/response.util";
import { INotificationService } from "../../services/interfaces/notification.service.interface";
import { IUserService } from "../../services/interfaces/user.services.interface";

export class NotificationController implements INotificationController {
  constructor(
    private readonly _notifySvc: INotificationService,
    private readonly _userSvc: IUserService
  ) {}

  async createNotification(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._notifySvc.create(req.body);
      sendSuccess(res, HttpStatus.CREATED, result);
    } catch (error) {
      console.log(error);
      sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create notification");
    }
  }

  async getAllNotifications(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._notifySvc.getAll();
      sendSuccess(res, HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch notifications");
    }
  }

  async getNotificationById(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._notifySvc.getById(req.params.id);
      if (!result) {
        sendError(res, HttpStatus.NOT_FOUND, "Notification not found");
        return;
      }
      sendSuccess(res, HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch notification");
    }
  }

  async updateNotification(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._notifySvc.update(
        req.params.id,
        req.body
      );
      if (!result) {
        sendError(res, HttpStatus.NOT_FOUND, "Notification not found");
        return;
      }
      sendSuccess(res, HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update notification");
    }
  }

  async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._notifySvc.delete(req.params.id);
      if (!result) {
        sendError(res, HttpStatus.NOT_FOUND, "Notification not found");
        return;
      }
      sendSuccess(res, HttpStatus.OK, { message: "Notification deleted successfully" });
    } catch (error) {
      console.log(error);
      sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete notification");
    }
  }

  async getNotificationByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        sendError(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
        return;
      }

      const result = await this._notifySvc.getNotificationByUserId(
        userId
      );
      sendSuccess(res, HttpStatus.OK, result);
    } catch (err) {
      console.log(err);
      sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch notification");
    }
  }

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        sendError(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
        return;
      }

      const result = await this._notifySvc.markAllAsRead(userId);
      sendSuccess(res, HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Failed to mark all notifications as read");
    }
  }
  async deleteAllNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        sendError(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
        return;
      }

      const result = await this._notifySvc.deleteAll(userId);
      sendSuccess(res, HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Failed to mark all notifications as read");
    }
  }
  async toggleUserNotification(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        sendError(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
        return;
      }

      const result = await this._userSvc.toggleUserNotification(userId);
      sendSuccess(res, HttpStatus.OK, { message: `Notification Toggle Successfully`, result });
    } catch (err: any) {
      console.log(err);
      sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Failed to toggle notification");
    }
  }
}
