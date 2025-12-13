import { Request, Response } from "express";
import { HttpStatus } from "@constants/http.status";
import { AppError, asyncHandler, sendSuccess } from "@utils/application";
import cloudinary from "@config/cloudinary.config";

import {
  IGroupCommandService,
  IGroupQueryService,
  IGroupMemberService,
  IGroupController
} from "@modules/chat";
import { AddMembersDto, AdminMemberDto, CreateGroupDto, DeleteGroupDto, GroupUserDto, JoinGroupDto, RemoveMemberDto, UpdateGroupDto } from "@modules/chat/dtos";
import { GroupQueryDto } from "../dtos/requests/group-query.dto";

export class GroupController implements IGroupController {
  constructor(
    private readonly _groupQuerySvc: IGroupQueryService,
    private readonly _groupCommandSvc: IGroupCommandService,
    private readonly _groupMemberSvc: IGroupMemberService
  ) { }

  createGroup = asyncHandler(async (req, res): Promise<void> => {
    const dto = CreateGroupDto.from(req.body);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const userId = req.user?.userId;
    const imgBuffer = req.file ? req.file.buffer : null;

    const group = await this._groupCommandSvc.createGroup(dto, imgBuffer as Buffer, userId);
    sendSuccess(res, HttpStatus.CREATED, group);
  });



  findByUser = asyncHandler(async (req, res): Promise<void> => {
    const dto = GroupUserDto.from({ userId: req.params.userId });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const result = await this._groupQuerySvc.findByUser(dto.userId);
    sendSuccess(res, HttpStatus.OK, result);
  });


  getAllGroups = asyncHandler(async (req, res): Promise<void> => {
    const dto = GroupQueryDto.fromQuery(req.query);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const result = await this._groupQuerySvc.getAllGroups(dto);
    sendSuccess(res, HttpStatus.OK, result, "All groups fetched successfully");
  });
  updateGroup = asyncHandler(async (req, res) => {
    const dto = UpdateGroupDto.from({ groupId: req.params.groupId, payload: req.body });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const updated = await this._groupCommandSvc.updateGroup(dto.groupId, dto.payload);
    sendSuccess(res, HttpStatus.OK, updated);
  });


  deleteGroup = asyncHandler(async (req, res) => {
    const dto = DeleteGroupDto.from({ groupId: req.params.groupId });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    await this._groupCommandSvc.deleteGroup(dto.groupId);
    sendSuccess(res, HttpStatus.OK, { success: true });
  });

  addMembers = asyncHandler(async (req, res) => {
    const dto = AddMembersDto.from({ groupId: req.params.groupId, memberIds: req.body.memberIds });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const result = await this._groupMemberSvc.addMembers(dto.groupId, dto.memberIds);
    sendSuccess(res, HttpStatus.OK, result);
  });


  removeMember = asyncHandler(async (req, res) => {
    const dto = RemoveMemberDto.from({ groupId: req.params.groupId, userId: req.params.userId });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const result = await this._groupMemberSvc.removeMember(dto.groupId, dto.userId);
    sendSuccess(res, HttpStatus.OK, result);
  });


  makeAdmin = asyncHandler(async (req, res) => {
    const dto = AdminMemberDto.from(req.body);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const result = await this._groupMemberSvc.makeAdmin(dto.conversationId, dto.groupId, dto.userId);
    sendSuccess(res, HttpStatus.OK, result);
  });

  removeAdmin = asyncHandler(async (req, res) => {
    const dto = AdminMemberDto.from(req.body);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const result = await this._groupMemberSvc.removeAdmin(dto.conversationId, dto.groupId, dto.userId);
    sendSuccess(res, HttpStatus.OK, result);
  });

  uploadProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.file) throw new AppError(HttpStatus.BAD_REQUEST, "No file uploaded");

    const imageFile = `data:image/png;base64,${req.file.buffer.toString("base64")}`;
    const uploaded = await cloudinary.v2.uploader.upload(imageFile, { folder: "groups" });

    sendSuccess(res, HttpStatus.OK, { imageUrl: uploaded.url }, "Image uploaded successfully");
  });

  sendJoinRequest = asyncHandler(async (req, res) => {
    const dto = JoinGroupDto.from({ groupId: req.params.groupId, userId: req.user?.userId });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const updated = await this._groupMemberSvc.sendJoinRequest(dto.groupId, dto.userId);
    sendSuccess(res, HttpStatus.OK, updated);
  });


}
