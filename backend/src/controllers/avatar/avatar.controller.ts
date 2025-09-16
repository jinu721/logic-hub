import { Request, Response } from "express";
import { IAvatarController } from "../avatar/avatar.controller.interface";
import { IAvatarService } from "../../services/interfaces/avatar.service.interface";
import { HttpStatus } from "../../constants/http.status";
import { sendError, sendSuccess } from "../../utils/application/response.util";
import { asyncHandler } from "../../utils/application/async.handler";
import { AppError } from "../../utils/application/app.error";

export class AvatarController implements IAvatarController {
  constructor(private readonly _avatarSvc: IAvatarService) {}

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, description, isActive, rarity } = req.body;

    if(!name || !description || !isActive || !rarity) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Name, Description, isActive and rarity are required");
    }

    let imageFile = "";

    if (req.file) {
      const mimeType = req.file.mimetype;
      const base64 = req.file.buffer.toString("base64");
      imageFile = `data:${mimeType};base64,${base64}`;
    }

    const data = await this._avatarSvc.createAvatar({
      name,
      description,
      isActive,
      rarity,
      image: imageFile,
    });

    sendSuccess(res, HttpStatus.OK, { data }, "Avatar created successfully");
  });

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const search = req.query.search as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const avatars = await this._avatarSvc.getAllAvatars(search, page, limit);
    sendSuccess(res, HttpStatus.OK, { data: avatars }, "Avatars fetched successfully");
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const avatar = await this._avatarSvc.getAvatarById(req.params.id);
    if (!avatar) {
      throw new AppError(HttpStatus.NOT_FOUND, "Avatar not found");
    }

    sendSuccess(res, HttpStatus.OK, { avatar }, "Avatar fetched successfully");
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updated = await this._avatarSvc.updateAvatar(req.params.id, req.body);
    if (!updated) {
      throw new AppError(HttpStatus.NOT_FOUND, "Avatar not found");
    }

    sendSuccess(res, HttpStatus.OK, { updated }, "Avatar updated successfully");
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const deleted = await this._avatarSvc.deleteAvatar(req.params.id);
    if (!deleted) {
      throw new AppError(HttpStatus.NOT_FOUND, "Avatar not found");
    }

    sendSuccess(res, HttpStatus.OK, { message: "Avatar deleted successfully" });
  });
}
