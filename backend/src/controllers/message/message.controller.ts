import { Request, Response } from "express";
import { IMessageService } from "../../services/interfaces/message.service.interface";
import { HttpStatus } from "../../shared/constants/http.status";
import { uploadFile } from "../../shared/utils/application/cloudinary.store";
import { IMessageController } from "../message/message.controller.interface";
import { sendSuccess } from "../../shared/utils/application/response.util";
import { asyncHandler } from "../../shared/utils/application/async.handler";
import { AppError } from "../../shared/utils/application/app.error";

export class MessageController implements IMessageController {
  constructor(private readonly _messageSvc: IMessageService) {}

  getMessages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const limit = Number(req.query.limit) || 10;
    const query = { ...req.query };
    delete query.limit;

    const messages = await this._messageSvc.getMessages(limit, query);
    sendSuccess(res, HttpStatus.OK, messages, "Messages fetched successfully");
  });

  editMessage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { messageId, newText } = req.body;
    if (!messageId || !newText) {
      throw new AppError(HttpStatus.BAD_REQUEST, "messageId and newText are required");
    }

    const result = await this._messageSvc.editMessage(messageId, newText);
    sendSuccess(res, HttpStatus.OK, result, "Message edited successfully");
  });

  deleteMessage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { messageId } = req.params;
    if (!messageId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "messageId is required");
    }

    const result = await this._messageSvc.deleteMessage(messageId);
    sendSuccess(res, HttpStatus.OK, result, "Message deleted successfully");
  });

  addReaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { messageId, userId, reaction } = req.body;
    if (!messageId || !userId || !reaction) {
      throw new AppError(HttpStatus.BAD_REQUEST, "messageId, userId and reaction are required");
    }

    const result = await this._messageSvc.addReaction(messageId, userId, reaction);
    sendSuccess(res, HttpStatus.OK, result, "Reaction added successfully");
  });

  removeReaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { messageId, userId, reaction } = req.body;
    if (!messageId || !userId || !reaction) {
      throw new AppError(HttpStatus.BAD_REQUEST, "messageId, userId and reaction are required");
    }

    const result = await this._messageSvc.removeReaction(messageId, userId, reaction);
    sendSuccess(res, HttpStatus.OK, result, "Reaction removed successfully");
  });

  markAsSeen = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { messageId, userId } = req.body;
    if (!messageId || !userId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "messageId and userId are required");
    }

    const result = await this._messageSvc.markAsSeen(messageId, userId);
    sendSuccess(res, HttpStatus.OK, result, "Message marked as seen");
  });

  getMessageById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { messageId } = req.params;
    if (!messageId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "messageId is required");
    }

    const result = await this._messageSvc.getMessageById(messageId);
    sendSuccess(res, HttpStatus.OK, result, "Message fetched successfully");
  });

  uploadMessage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const file = req.file;
    const { type } = req.body;

    if (!file || !type) {
      throw new AppError(HttpStatus.BAD_REQUEST, "File and type are required");
    }

    const uploadedUrl = await uploadFile(file, type);
    sendSuccess(res, HttpStatus.OK, { url: uploadedUrl }, "File uploaded successfully");
  });
}
