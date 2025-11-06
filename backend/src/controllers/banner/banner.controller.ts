import { Request, Response } from "express";
import { IBannerController } from "./banner.controller.interface";
import { IBannerService } from "../../services/interfaces/banner.service.interface";
import { HttpStatus } from "../../shared/constants/http.status";
import { sendSuccess } from "../../shared/utils/application/response.util";
import { asyncHandler } from "../../shared/utils/application/async.handler";
import { AppError } from "../../shared/utils/application/app.error";

export class BannerController implements IBannerController {
  constructor(private readonly _bannerSvc: IBannerService) {}

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

    const data = await this._bannerSvc.createBanner({
      name,
      description,
      isActive,
      rarity,
      image: imageFile,
    });

    sendSuccess(res, HttpStatus.OK, { data }, "Banner created successfully");
  });

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const search = req.query.search as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const banners = await this._bannerSvc.getAllBanners(search, page, limit);
    sendSuccess(res, HttpStatus.OK, { data: banners }, "Banners fetched successfully");
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const banner = await this._bannerSvc.getBannerById(req.params.id);
    if (!banner) {
      throw new AppError(HttpStatus.NOT_FOUND, "Banner not found");
    }

    sendSuccess(res, HttpStatus.OK, { banner }, "Banner fetched successfully");
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updated = await this._bannerSvc.updateBanner(req.params.id, req.body);
    if (!updated) {
      throw new AppError(HttpStatus.NOT_FOUND, "Banner not found");
    }

    sendSuccess(res, HttpStatus.OK, { updated }, "Banner updated successfully");
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const deleted = await this._bannerSvc.deleteBanner(req.params.id);
    if (!deleted) {
      throw new AppError(HttpStatus.NOT_FOUND, "Banner not found");
    }

    sendSuccess(res, HttpStatus.OK, { message: "Banner deleted successfully" });
  });
}
