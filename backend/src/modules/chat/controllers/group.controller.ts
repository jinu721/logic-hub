import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "@constants/http.status";
import { AppError, asyncHandler, sendSuccess } from "@utils/application";
import cloudinary from "@config/cloudinary.config";

import {
  IGroupCommandService,
  IGroupQueryService,
  IGroupMemberService,
} from "@modules/chat/interfaces";
import { IGroupController } from "@modules/chat/interfaces";

export class GroupController implements IGroupController {
  constructor(
    private readonly _groupQuerySvc: IGroupQueryService,
    private readonly _groupCommandSvc: IGroupCommandService,
    private readonly _groupMemberSvc: IGroupMemberService
  ) {}

  createGroup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    if (typeof req.body.members === "string") {
      req.body.members = JSON.parse(req.body.members);
    }

    const imageBuffer = req.file ? req.file.buffer : null;
    const group = await this._groupCommandSvc.createGroup(req.body, imageBuffer as Buffer, userId);

    sendSuccess(res, HttpStatus.CREATED, group, "Group created successfully");
  });


  findByUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    if (!userId) throw new AppError(HttpStatus.BAD_REQUEST, "UserId is required");

    const result = await this._groupQuerySvc.findByUser(userId);
    sendSuccess(res, HttpStatus.OK, result, "Groups fetched successfully");
  });

  getAllGroups = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this._groupQuerySvc.getAllGroups(req.query);
    sendSuccess(res, HttpStatus.OK, result, "All groups fetched successfully");
  });

  updateGroup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { groupId } = req.params;
    if (!groupId) throw new AppError(HttpStatus.BAD_REQUEST, "GroupId is required");

    const updated = await this._groupCommandSvc.updateGroup(groupId, req.body);
    sendSuccess(res, HttpStatus.OK, updated, "Group updated successfully");
  });

  deleteGroup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { groupId } = req.params;
    if (!groupId) throw new AppError(HttpStatus.BAD_REQUEST, "GroupId is required");

    await this._groupCommandSvc.deleteGroup(groupId);
    sendSuccess(res, HttpStatus.OK, { success: true }, "Group deleted successfully");
  });

  addMembers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { groupId } = req.params;
    const { memberIds } = req.body;
    if (!groupId || !memberIds)
      throw new AppError(HttpStatus.BAD_REQUEST, "GroupId and memberIds are required");

    const result = await this._groupMemberSvc.addMembers(groupId, memberIds);
    sendSuccess(res, HttpStatus.OK, result, "Members added successfully");
  });

  removeMember = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { groupId, userId } = req.params;
    if (!groupId || !userId)
      throw new AppError(HttpStatus.BAD_REQUEST, "GroupId and userId are required");

    const result = await this._groupMemberSvc.removeMember(groupId, userId);
    sendSuccess(res, HttpStatus.OK, result, "Member removed successfully");
  });

  makeAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { conversationId, groupId, userId } = req.body;
    if (!conversationId || !groupId || !userId)
      throw new AppError(HttpStatus.BAD_REQUEST, "conversationId, groupId, and userId are required");

    const result = await this._groupMemberSvc.makeAdmin(conversationId, groupId, userId);
    sendSuccess(res, HttpStatus.OK, result, "Member promoted to admin successfully");
  });

  removeAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { conversationId, groupId, userId } = req.body;
    if (!conversationId || !groupId || !userId)
      throw new AppError(HttpStatus.BAD_REQUEST, "conversationId, groupId, and userId are required");

    const result = await this._groupMemberSvc.removeAdmin(conversationId, groupId, userId);
    sendSuccess(res, HttpStatus.OK, result, "Admin demoted successfully");
  });

  uploadProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.file) throw new AppError(HttpStatus.BAD_REQUEST, "No file uploaded");

    const imageFile = `data:image/png;base64,${req.file.buffer.toString("base64")}`;
    const uploaded = await cloudinary.v2.uploader.upload(imageFile, { folder: "groups" });

    sendSuccess(res, HttpStatus.OK, { imageUrl: uploaded.url }, "Image uploaded successfully");
  });

  sendJoinRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { groupId } = req.params;
    if (!groupId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "GroupId is required");
    }

    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const updatedGroup = await this._groupMemberSvc.sendJoinRequest(groupId, userId);
    sendSuccess(res, HttpStatus.OK, updatedGroup, "Join request sent successfully");
  });

}
