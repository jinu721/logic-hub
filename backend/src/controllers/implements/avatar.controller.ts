import { Request, Response } from "express";
import { IAvatarController } from "../interfaces/avatar.controller.interface";
import { IAvatarService } from "../../services/interfaces/avatar.service.interface";
import { HttpStatus } from "../../constants/http.status";

export class AvatarController implements IAvatarController {
  constructor(private avatarService: IAvatarService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, isActive, rarity } = req.body;
      let imageFile = "";
      if (req.file) {
        const mimeType = req.file.mimetype;
        const base64 = req.file.buffer.toString("base64");
        imageFile = `data:${mimeType};base64,${base64}`;
      }
      const data = await this.avatarService.createAvatar({
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
            err instanceof Error ? err.message : "Failed to create avatar",
        });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search;
      const page = req.query.page;
      const limit = req.query.limit;
      const avatars = await this.avatarService.getAllAvatars(search as string,Number(page),Number(limit));
      res.status(HttpStatus.OK).json({ success: true, data: avatars });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message:
            err instanceof Error ? err.message : "Failed to fetch avatars",
        });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const avatar = await this.avatarService.getAvatarById(req.params.id);
      if (!avatar) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: "Avatar not found" });
        return;
      }
      res.status(HttpStatus.OK).json({ success: true, avatar });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message:
            err instanceof Error ? err.message : "Failed to fetch avatar",
        });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const updated = await this.avatarService.updateAvatar(
        req.params.id,
        req.body
      );
      if (!updated) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: "Avatar not found" });
        return;
      }
      res.status(HttpStatus.OK).json({ success: true, updated });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message:
            err instanceof Error ? err.message : "Failed to update avatar",
        });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.avatarService.deleteAvatar(req.params.id);
      if (!deleted) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: "Avatar not found" });
        return;
      }
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Avatar deleted successfully" });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message:
            err instanceof Error ? err.message : "Failed to delete avatar",
        });
    }
  }
}
