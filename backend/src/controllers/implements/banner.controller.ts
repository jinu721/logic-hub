import { Request, Response } from "express";
import { IBannerController } from "../interfaces/banner.controller.interface";
import { IBannerService } from "../../services/interfaces/banner.service.interface";
import { HttpStatus } from "../../constants/http.status";

export class BannerController implements IBannerController {
  constructor(private avatarService: IBannerService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, isActive, rarity } = req.body;
      let imageFile = "";
      if (req.file) {
        const mimeType = req.file.mimetype;
        const base64 = req.file.buffer.toString("base64");
        imageFile = `data:${mimeType};base64,${base64}`;
      }
      const data = await this.avatarService.createBanner({
        name,
        description,
        isActive,
        rarity,
        image: imageFile,
      });
      res.status(HttpStatus.OK).json({ success: true, data });
    } catch (err) {
      console.log(err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message:
            err instanceof Error ? err.message : "Failed to create banner",
        });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search;
      const page = req.query.page;
      const limit = req.query.limit;
      const avatars = await this.avatarService.getAllBanners(search as string,Number(page),Number(limit));
      res.status(HttpStatus.OK).json({ success: true, data: avatars });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message:
            err instanceof Error ? err.message : "Failed to fetch banner",
        });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const avatar = await this.avatarService.getBannerById(req.params.id);
      if (!avatar) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: "Banner not found" });
        return;
      }
      res.status(HttpStatus.OK).json({ success: true, avatar });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message:
            err instanceof Error ? err.message : "Failed to fetch banner",
        });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const updated = await this.avatarService.updateBanner(
        req.params.id,
        req.body
      );
      if (!updated) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: "Banner not found" });
        return;
      }
      res.status(HttpStatus.OK).json({ success: true, updated });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message:
            err instanceof Error ? err.message : "Failed to update banner",
        });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.avatarService.deleteBanner(req.params.id);
      if (!deleted) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: "Banner not found" });
        return;
      }
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Banner deleted successfully" });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message:
            err instanceof Error ? err.message : "Failed to delete banner",
        });
    }
  }
}
