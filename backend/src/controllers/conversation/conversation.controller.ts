import { Request, Response } from "express";
import { IConversationService } from "../../services/interfaces/conversation.service.interface";
import { HttpStatus } from "../../constants/http.status";
import { IConversationController } from "./conversation.controller.interface";
import { sendSuccess } from "../../utils/application/response.util";
import { asyncHandler } from "../../utils/application/async.handler";
import { AppError } from "../../utils/application/app.error";

export class ConversationController implements IConversationController {
  constructor(private readonly _conversationSvc: IConversationService) {}

  createOneToOne = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;
    if (!userId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "User ID is required");
    }

    const currentUserId = (req as any).user?.userId;
    if (!currentUserId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const conversation = await this._conversationSvc.createOneToOne(userId, currentUserId);
    sendSuccess(res, HttpStatus.CREATED, { success: true, data: conversation }, "Conversation created successfully");
  });

  findOneToOne = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userA, userB } = req.params;
    if (!userA || !userB) {
      throw new AppError(HttpStatus.BAD_REQUEST, "User IDs are required");
    }

    const conversation = await this._conversationSvc.findOneToOne(userA, userB);
    sendSuccess(res, HttpStatus.OK, { success: true, data: conversation }, "Conversation found successfully");
  });

  findConversation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { conversationId } = req.params;
    if (!conversationId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Conversation ID is required");
    }

    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const conversation = await this._conversationSvc.findConversation(conversationId, userId);
    sendSuccess(res, HttpStatus.OK, { success: true, data: conversation }, "Conversation found successfully");
  });

  findConversationByUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const currentUserId = (req as any).user?.userId;
    if (!currentUserId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const userId = req.params.id === "me" ? currentUserId : req.params.id;
    if (!userId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "User ID is required");
    }

    const conversation = await this._conversationSvc.findConversations(userId, req.query);
    sendSuccess(res, HttpStatus.OK, { success: true, data: conversation }, "Conversations found successfully");
  });

  findConversationByGroup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { groupId } = req.params;
    if (!groupId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Group ID is required");
    }

    const conversation = await this._conversationSvc.findConversationByGroup(groupId);
    sendSuccess(res, HttpStatus.OK, { success: true, data: conversation }, "Conversation found successfully");
  });

  setTypingUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { conversationId, userId } = req.body;
    if (!conversationId || !userId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "ConversationId and UserId are required");
    }

    const updated = await this._conversationSvc.setTypingUser(conversationId, userId);
    sendSuccess(res, HttpStatus.OK, { success: true, data: updated }, "Typing user set successfully");
  });

  removeTypingUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { conversationId, userId } = req.body;
    if (!conversationId || !userId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "ConversationId and UserId are required");
    }

    const updated = await this._conversationSvc.removeTypingUser(conversationId, userId);
    sendSuccess(res, HttpStatus.OK, { success: true, data: updated }, "Typing user removed successfully");
  });

  getTypingUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { conversationId } = req.params;
    if (!conversationId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "ConversationId is required");
    }

    const users = await this._conversationSvc.getTypingUsers(conversationId);
    sendSuccess(res, HttpStatus.OK, { success: true, data: users }, "Typing users fetched successfully");
  });
}
