import { Request, Response } from "express";
import { HttpStatus } from "../../shared/constants/http.status";
import { IGroupController } from "./group.controller.interface";
import { IGroupService } from "../../services/interfaces/group.service.interface";
import cloudinary from "../../config/cloudinary.config";
import { sendSuccess } from "../../shared/utils/application/response.util";
import { asyncHandler } from "../../shared/utils/application/async.handler";
import { AppError } from "../../shared/utils/application/app.error";

export class GroupController implements IGroupController {
  constructor(private readonly _groupSvc: IGroupService) {}

  createGroup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    if (typeof req.body.members === "string") {
      req.body.members = JSON.parse(req.body.members);
    }

    const imageBuffer = req.file ? req.file.buffer : null;
    const result = await this._groupSvc.createGroup(req.body, imageBuffer as Buffer, userId);

    sendSuccess(res, HttpStatus.CREATED, result, "Group created successfully");
  });

  findByUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    if (!userId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "UserId is required");
    }

    const result = await this._groupSvc.findByUser(userId);
    sendSuccess(res, HttpStatus.OK, result, "Groups fetched successfully");
  });

  getAllGroups = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this._groupSvc.getAllGroups(req.query);
    sendSuccess(res, HttpStatus.OK, result, "All groups fetched successfully");
  });

  updateGroup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { groupId } = req.params;
    if (!groupId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "GroupId is required");
    }

    const result = await this._groupSvc.updateGroup(groupId, req.body);
    sendSuccess(res, HttpStatus.OK, result, "Group updated successfully");
  });

  deleteGroup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { groupId } = req.params;
    if (!groupId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "GroupId is required");
    }

    const result = await this._groupSvc.deleteGroup(groupId);
    sendSuccess(res, HttpStatus.OK, { success: result }, "Group deleted successfully");
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

    const updatedGroup = await this._groupSvc.sendJoinRequest(groupId, userId);
    sendSuccess(res, HttpStatus.OK, updatedGroup, "Join request sent successfully");
  });

  uploadProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      throw new AppError(HttpStatus.BAD_REQUEST, "No file uploaded");
    }

    const imageFile = `data:image/png;base64,${req.file.buffer.toString("base64")}`;
    const uploadedImage = await cloudinary.v2.uploader.upload(imageFile, { folder: "groups" });

    sendSuccess(res, HttpStatus.OK, { imageUrl: uploadedImage.url }, "Image uploaded successfully");
  });
}
