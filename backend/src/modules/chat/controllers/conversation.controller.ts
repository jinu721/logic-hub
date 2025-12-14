import { Request, Response } from "express";
import {
  IConversationController,
  IConversationCommandService,
  IConversationQueryService,
  IConversationTypingService,
} from "@modules/chat";
import { CreateOneToOneDto, FindConversationDto, FindConversationGroupDto, FindConversationsByUserDto, FindOneToOneDto, GetTypingUsersDto, TypingUserDto } from "@modules/chat/dtos";
import { HttpStatus } from "@constants";
import { sendSuccess, asyncHandler, AppError } from "@utils/application";

export class ConversationController implements IConversationController {
  constructor(
    private readonly _convCommandSvc: IConversationCommandService,
    private readonly _convQuerySvc: IConversationQueryService,
    private readonly _convTypingSvc: IConversationTypingService
  ) { }

  createOneToOne = asyncHandler(async (req, res): Promise<void> => {
    console.log(req.body);
    const dto = CreateOneToOneDto.from(req.body);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const currentUserId = req.user?.userId;
    if (!currentUserId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const conversation = await this._convCommandSvc.createOneToOne(dto.userId, currentUserId);
    sendSuccess(res, HttpStatus.CREATED, { success: true, data: conversation });
  });


  findOneToOne = asyncHandler(async (req, res): Promise<void> => {
    const dto = FindOneToOneDto.from({ userA: req.params.userA, userB: req.params.userB });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const conversation = await this._convQuerySvc.findOneToOne(dto.userA, dto.userB);
    sendSuccess(res, HttpStatus.OK, { success: true, data: conversation });
  });


  findConversation = asyncHandler(async (req, res): Promise<void> => {
    const dto = FindConversationDto.from({
      conversationId: req.params.conversationId,
      userId: req.user?.userId
    });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const conversation = await this._convQuerySvc.findConversation(dto.conversationId, dto.userId);
    sendSuccess(res, HttpStatus.OK, { success: true, data: conversation });
  });


  findConversationByUser = asyncHandler(async (req, res): Promise<void> => {
    const userIdParam = req.params.id === "me" ? req.user?.userId : req.params.id;

    const dto = FindConversationsByUserDto.from({ userId: userIdParam });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const conversation = await this._convQuerySvc.findConversations(dto.userId, req.query);
    sendSuccess(res, HttpStatus.OK, { success: true, data: conversation });
  });

  findConversationByGroup = asyncHandler(async (req, res): Promise<void> => {
    const dto = FindConversationGroupDto.from({ groupId: req.params.groupId });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const conversation = await this._convQuerySvc.findConversationByGroup(dto.groupId);
    sendSuccess(res, HttpStatus.OK, { success: true, data: conversation });
  });

  setTypingUser = asyncHandler(async (req, res): Promise<void> => {
    const dto = TypingUserDto.from(req.body);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const updated = await this._convTypingSvc.setTypingUser(dto.conversationId, dto.userId);
    sendSuccess(res, HttpStatus.OK, { success: true, data: updated });
  });


  removeTypingUser = asyncHandler(async (req, res): Promise<void> => {
    const dto = TypingUserDto.from(req.body);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const updated = await this._convTypingSvc.removeTypingUser(dto.conversationId, dto.userId);
    sendSuccess(res, HttpStatus.OK, { success: true, data: updated });
  });


  getTypingUsers = asyncHandler(async (req, res): Promise<void> => {
    const dto = GetTypingUsersDto.from({ conversationId: req.params.conversationId });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const users = await this._convTypingSvc.getTypingUsers(dto.conversationId);
    sendSuccess(res, HttpStatus.OK, { success: true, data: users });
  });

}
