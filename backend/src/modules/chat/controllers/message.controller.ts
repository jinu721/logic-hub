import { Request, Response } from "express";
import {
  IMessageQueryService,
  IMessageCommandService,
  IMessageEngagementService,
  IMessageController
} from "@modules/chat";

import { HttpStatus } from "@constants";
import { sendSuccess, asyncHandler, AppError, uploadFile } from "@utils/application";

export class MessageController implements IMessageController  {
  constructor(
    private readonly querySvc: IMessageQueryService,
    private readonly commandSvc: IMessageCommandService,
    private readonly engagementSvc: IMessageEngagementService
  ) {}

  getMessages = asyncHandler(async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 10
    const query = { ...req.query }
    delete query.limit

    const messages = await this.querySvc.getMessages(limit, query)
    sendSuccess(res, HttpStatus.OK, messages, "Messages fetched successfully")
  })

  editMessage = asyncHandler(async (req: Request, res: Response) => {
    const { messageId, newText } = req.body
    if (!messageId || !newText) {
      throw new AppError(HttpStatus.BAD_REQUEST, "messageId and newText are required")
    }

    const result = await this.commandSvc.editMessage(messageId, newText)
    sendSuccess(res, HttpStatus.OK, result, "Message edited successfully")
  })

  deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    const { messageId } = req.params
    if (!messageId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "messageId is required")
    }

    const result = await this.commandSvc.deleteMessage(messageId)
    sendSuccess(res, HttpStatus.OK, result, "Message deleted successfully")
  })

  addReaction = asyncHandler(async (req: Request, res: Response) => {
    const { messageId, userId, reaction } = req.body
    if (!messageId || !userId || !reaction) {
      throw new AppError(HttpStatus.BAD_REQUEST, "messageId, userId and reaction are required")
    }

    const result = await this.engagementSvc.addReaction(messageId, userId, reaction)
    sendSuccess(res, HttpStatus.OK, result, "Reaction added successfully")
  })

  removeReaction = asyncHandler(async (req: Request, res: Response) => {
    const { messageId, userId, reaction } = req.body
    if (!messageId || !userId || !reaction) {
      throw new AppError(HttpStatus.BAD_REQUEST, "messageId, userId and reaction are required")
    }

    const result = await this.engagementSvc.removeReaction(messageId, userId, reaction)
    sendSuccess(res, HttpStatus.OK, result, "Reaction removed successfully")
  })

  markAsSeen = asyncHandler(async (req: Request, res: Response) => {
    const { messageId, userId } = req.body
    if (!messageId || !userId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "messageId and userId are required")
    }

    const result = await this.engagementSvc.markAsSeen(messageId, userId)
    sendSuccess(res, HttpStatus.OK, result, "Message marked as seen")
  })

  getMessageById = asyncHandler(async (req: Request, res: Response) => {
    const { messageId } = req.params
    if (!messageId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "messageId is required")
    }

    const result = await this.querySvc.getMessageById(messageId)
    sendSuccess(res, HttpStatus.OK, result, "Message fetched successfully")
  })

  uploadMessage = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file
    const { type } = req.body

    if (!file || !type) {
      throw new AppError(HttpStatus.BAD_REQUEST, "File and type are required")
    }

    const uploadedUrl = await uploadFile(file, type)
    sendSuccess(res, HttpStatus.OK, { url: uploadedUrl }, "File uploaded successfully")
  })
}
