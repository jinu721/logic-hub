import { Request, Response } from "express";
import { INotificationController } from "./notification.controller.interface";
import { HttpStatus } from "../../constants/http.status";
import { sendSuccess } from "../../utils/application/response.util";
import { INotificationService } from "../../services/interfaces/notification.service.interface";
import { IUserService } from "../../services/interfaces/user.services.interface";
import { asyncHandler } from "../../utils/application/async.handler";
import { AppError } from "../../utils/application/app.error";

export class NotificationController implements INotificationController {
  constructor(
    private readonly _notifySvc: INotificationService,
    private readonly _userSvc: IUserService
  ) {}

  createNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.body) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Notification data is required");
    }

    const result = await this._notifySvc.create(req.body);
    sendSuccess(res, HttpStatus.CREATED, result, "Notification created successfully");
  });

  getAllNotifications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this._notifySvc.getAll();
    sendSuccess(res, HttpStatus.OK, result, "Notifications fetched successfully");
  });

  getNotificationById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Notification ID is required");
    }

    const result = await this._notifySvc.getById(id);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Notification not found");
    }

    sendSuccess(res, HttpStatus.OK, result, "Notification fetched successfully");
  });

  updateNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Notification ID is required");
    }
    if (!req.body) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Update data is required");
    }

    const result = await this._notifySvc.update(id, req.body);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Notification not found");
    }

    sendSuccess(res, HttpStatus.OK, result, "Notification updated successfully");
  });

  deleteNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Notification ID is required");
    }

    const result = await this._notifySvc.delete(id);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Notification not found");
    }

    sendSuccess(res, HttpStatus.OK, { message: "Notification deleted successfully" });
  });

  getNotificationByUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const result = await this._notifySvc.getNotificationByUserId(userId);
    sendSuccess(res, HttpStatus.OK, result, "User notifications fetched successfully");
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const result = await this._notifySvc.markAllAsRead(userId);
    sendSuccess(res, HttpStatus.OK, result, "All notifications marked as read");
  });

  deleteAllNotifications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const result = await this._notifySvc.deleteAll(userId);
    sendSuccess(res, HttpStatus.OK, result, "All notifications deleted successfully");
  });

  toggleUserNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const result = await this._userSvc.toggleUserNotification(userId);
    sendSuccess(res, HttpStatus.OK, { message: "Notification toggled successfully", result });
  });
}
