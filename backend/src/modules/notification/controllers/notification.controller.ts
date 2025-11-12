import { Request, Response } from "express";
import { INotificationController, INotificationService } from "@modules/notification";
import { HttpStatus } from "@constants/http.status";
import { sendSuccess, asyncHandler, AppError } from "@utils/application";


export class NotificationController implements INotificationController {
  constructor(
    private readonly _notifySvc: INotificationService,
  ) {}

  createNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.body) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Notification data is required");
    }

    const result = await this._notifySvc.createNotification(req.body);
    sendSuccess(res, HttpStatus.CREATED, result, "Notification created successfully");
  });

  getAllNotifications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this._notifySvc.getAllNotifications();
    sendSuccess(res, HttpStatus.OK, result, "Notifications fetched successfully");
  });

  getNotificationById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Notification ID is required");
    }

    const result = await this._notifySvc.getNotificationById(id);
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

    const result = await this._notifySvc.updateNotification(id, req.body);
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

    const result = await this._notifySvc.deleteNotification(id);
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

    const result = await this._notifySvc.deleteAllNotification(userId);
    sendSuccess(res, HttpStatus.OK, result, "All notifications deleted successfully");
  });

}
