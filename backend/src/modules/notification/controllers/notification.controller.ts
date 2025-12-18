import { Request, Response } from "express";
import { AuthRequest } from "@shared/types";
import { INotificationController, INotificationService } from "@modules/notification";
import { CreateNotificationDto, DeleteNotificationDto, GetNotificationDto, UpdateNotificationDto } from "@modules/notification/dtos";
import { HttpStatus } from "@constants/http.status";
import { sendSuccess, asyncHandler, AppError } from "@utils/application";


export class NotificationController implements INotificationController {
  constructor(
    private readonly _notifySvc: INotificationService,
  ) { }

  createNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = CreateNotificationDto.from(req.body);
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const result = await this._notifySvc.createNotification(dto);
    sendSuccess(res, HttpStatus.CREATED, result, "Notification created successfully");
  });

  getAllNotifications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this._notifySvc.getAllNotifications();
    sendSuccess(res, HttpStatus.OK, result, "Notifications fetched successfully");
  });

  getNotificationById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = GetNotificationDto.from(req.params);
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const result = await this._notifySvc.getNotificationById(dto.id);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Notification not found");
    }

    sendSuccess(res, HttpStatus.OK, result, "Notification fetched successfully");
  });

  updateNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = UpdateNotificationDto.from({ id: req.params.id, ...req.body });
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const result = await this._notifySvc.updateNotification(dto.id, dto);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Notification not found");
    }

    sendSuccess(res, HttpStatus.OK, result, "Notification updated successfully");
  });

  deleteNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = DeleteNotificationDto.from(req.params);
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const result = await this._notifySvc.deleteNotification(dto.id);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Notification not found");
    }

    sendSuccess(res, HttpStatus.OK, { message: "Notification deleted successfully" });
  });

  getNotificationByUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const result = await this._notifySvc.getNotificationByUserId(userId);
    sendSuccess(res, HttpStatus.OK, result, "User notifications fetched successfully");
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const result = await this._notifySvc.markAllAsRead(userId);
    sendSuccess(res, HttpStatus.OK, result, "All notifications marked as read");
  });

  deleteAllNotifications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const result = await this._notifySvc.deleteAllNotification(userId);
    sendSuccess(res, HttpStatus.OK, result, "All notifications deleted successfully");
  });

}
