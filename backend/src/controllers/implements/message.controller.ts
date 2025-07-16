import { Request, Response } from "express";
import { IMessageService } from "../../services/interfaces/message.service.interface";
import { HttpStatus } from "../../constants/http.status";
import { uploadFile } from "../../utils/cloudnary.store";

export class MessageController {
  constructor(private messageService: IMessageService) {}


  getMessages = async (req: Request, res: Response) => {
    try {
      const { limit, ...query } = req.query;
      const messages = await this.messageService.getMessages(Number(limit), query);
      res.status(HttpStatus.OK).json({ success: true, data: messages });
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch messages" });
    }
  };

  editMessage = async (req: Request, res: Response) => {
    try {
      const { messageId, newText } = req.body;
      const result = await this.messageService.editMessage(messageId, newText);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to edit message" });
    }
  };

  deleteMessage = async (req: Request, res: Response) => {
    try {
      const { messageId } = req.params;
      const result = await this.messageService.deleteMessage(messageId);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to delete message" });
    }
  };

  addReaction = async (req: Request, res: Response) => {
    try {
      const { messageId, userId, reaction } = req.body;
      const result = await this.messageService.addReaction(messageId, userId, reaction);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to add reaction" });
    }
  };

  removeReaction = async (req: Request, res: Response) => {
    try {
      const { messageId, userId, reaction } = req.body;
      const result = await this.messageService.removeReaction(messageId, userId, reaction);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to remove reaction" });
    }
  };

  markAsSeen = async (req: Request, res: Response) => {
    try {
      const { messageId, userId } = req.body;
      const result = await this.messageService.markAsSeen(messageId, userId);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to mark as seen" });
    }
  };

  getMessageById = async (req: Request, res: Response) => {
    try {
      const { messageId } = req.params;
      const result = await this.messageService.getMessageById(messageId);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to get message" });
    }
  };

async uploadMessage(req: Request, res: Response): Promise<void> {

  try {
    const file = req.file;
    const { type } = req.body;

    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    console.log("Uploaded File:", {
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size
    });

    const uploadedUrl = await uploadFile(file, type);

    res.json({ url: uploadedUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

}
