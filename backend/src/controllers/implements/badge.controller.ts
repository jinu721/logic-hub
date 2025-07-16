import { Request, Response } from "express";
import { IBadgeController } from "../interfaces/badge.controller.interface";
import { IBadgeService} from "../../services/interfaces/badge.service.interface";
import { HttpStatus } from "../../constants/http.status";

export class BadgeController implements IBadgeController {
  constructor(private avatarService: IBadgeService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const {name,description,isActive,rarity} = req.body;
      let imageFile = "";
      if (req.file) {
        const mimeType = req.file.mimetype;
        const base64 = req.file.buffer.toString("base64");
        imageFile = `data:${mimeType};base64,${base64}`;
      }
      const data = await this.avatarService.createBadge({name,description,isActive,rarity,image:imageFile});
      res.status(HttpStatus.OK).json({ success: true, data });
    } catch (err) {
        console.log(err)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message:err instanceof Error ? err.message: "Failed to create badge" });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search;
      const page = req.query.page;
      const limit = req.query.limit;
      const avatars = await this.avatarService.getAllBadges(search as string,Number(page),Number(limit));
      res.status(HttpStatus.OK).json({ success: true, data:avatars });
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message:err instanceof Error ? err.message: "Failed to fetch badges" });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const avatar = await this.avatarService.getBadgeById(req.params.id);
      if (!avatar) {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Badge not found" });
        return;
      }
      res.status(HttpStatus.OK).json({ success: true, avatar });
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message:err instanceof Error ? err.message: "Failed to fetch badge" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const updated = await this.avatarService.updateBadge(req.params.id, req.body);
      if (!updated) {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Badge not found" });
        return;
      }
      res.status(HttpStatus.OK).json({ success: true, updated });
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message:err instanceof Error ? err.message: "Failed to update badge" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.avatarService.deleteBadge(req.params.id);
      if (!deleted) {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Badge not found" });
        return;
      }
      res.status(HttpStatus.OK).json({ success: true, message: "Badge deleted successfully" });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message:err instanceof Error ? err.message: "Failed to delete badge" });
    }
  }
  
}
