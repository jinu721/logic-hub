import { Request, Response } from "express";
import { HttpStatus } from "../../constants/http.status";
import { IGroupController } from "../interfaces/group.controller.interface";
import { GroupService } from "../../services/implements/group.service";
import cloudinary from "../../config/cloudinary.config";

export class GroupController implements IGroupController {
  constructor(private groupService: GroupService) {}

  createGroup = async (req: Request, res: Response) => {
    try {
      if (typeof req.body.members === "string") {
        req.body.members = JSON.parse(req.body.members);
      }

      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const imageBuffer = req.file ? req.file.buffer : null;

      const result = await this.groupService.createGroup(
        req.body,
        imageBuffer as Buffer,
        userId
      );

      console.log("Result");

      res.status(HttpStatus.CREATED).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to create X" });
    }
  };

  findByUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const result = await this.groupService.findByUser(userId);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (err) {
      console.log(err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to find group" });
    }
  };

  getAllGroups = async (req: Request, res: Response) => {
    try {
      const search = req.query.search;
      const page = req.query.page;
      const limit = req.query.limit;
      const result = await this.groupService.getAllGroups(req.query);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (err) {
      console.log(err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to find group" });
    }
  };

  updateGroup = async (req: Request, res: Response) => {
    try {
      const { groupId } = req.params;
      const result = await this.groupService.updateGroup(groupId, req.body);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (err) {
      console.log(err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to update group" });
    }
  };

  deleteGroup = async (req: Request, res: Response) => {
    try {
      const { groupId } = req.params;
      const result = await this.groupService.deleteGroup(groupId);
      res.status(HttpStatus.OK).json({ success: result });
    } catch (err) {
      console.log(err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to delete group" });
    }
  };

  sendJoinRequest = async (req: Request, res: Response) => {
    const { groupId } = req.params;

    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
      return;
    }

    
    try {
      const updatedGroup = await this.groupService.sendJoinRequest(
        groupId,
        userId
      );
      res.json({ success: true, data: updatedGroup });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Failed to send join request" });
    }
  };

  uploadProfile = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }
      let imageFile = "";
      if (req.file) {
        imageFile = `data:image/png;base64,${req.file.buffer.toString(
          "base64"
        )}` as string;
      }

      const uploadedImage = await cloudinary.v2.uploader.upload(imageFile, {
        folder: "groups",
      });

      res.json({ imageUrl: uploadedImage.url });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: err instanceof Error ? err.message : "Erro Uploading Image",
        });
    }
  };
}
