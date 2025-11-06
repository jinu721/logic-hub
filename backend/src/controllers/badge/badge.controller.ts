import { Request, Response } from "express";
import { IBadgeController } from "./badge.controller.interface";
import { IBadgeService } from "../../services/interfaces/badge.service.interface";
import { HttpStatus } from "../../shared/constants/http.status";
import { sendSuccess } from "../../shared/utils/application/response.util";
import { asyncHandler } from "../../shared/utils/application/async.handler";
import { AppError } from "../../shared/utils/application/app.error";

export class BadgeController implements IBadgeController {
  constructor(private readonly _badgeSvc: IBadgeService) {}

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

    const data = await this._badgeSvc.createBadge({ name, description, isActive, rarity, image: imageFile });
    sendSuccess(res, HttpStatus.OK, { data }, "Badge created successfully");
  });

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const search = req.query.search as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const badges = await this._badgeSvc.getAllBadges(search, page, limit);
    sendSuccess(res, HttpStatus.OK, { data: badges }, "Badges fetched successfully");
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const badge = await this._badgeSvc.getBadgeById(req.params.id);
    if (!badge) {
      throw new AppError(HttpStatus.NOT_FOUND, "Badge not found");
    }

    sendSuccess(res, HttpStatus.OK, { badge }, "Badge fetched successfully");
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updated = await this._badgeSvc.updateBadge(req.params.id, req.body);
    if (!updated) {
      throw new AppError(HttpStatus.NOT_FOUND, "Badge not found");
    }

    sendSuccess(res, HttpStatus.OK, { updated }, "Badge updated successfully");
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const deleted = await this._badgeSvc.deleteBadge(req.params.id);
    if (!deleted) {
      throw new AppError(HttpStatus.NOT_FOUND, "Badge not found");
    }

    sendSuccess(res, HttpStatus.OK, { message: "Badge deleted successfully" });
  });
}
