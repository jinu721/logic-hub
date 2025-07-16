import { Request, Response } from "express";
import { IConversationService } from "../../services/interfaces/conversation.service.interface";
import { HttpStatus } from "../../constants/http.status";
import { IConversationController } from "../interfaces/conversation.controller.interface";

export class ConversationController implements IConversationController {
  constructor(private conversationService: IConversationService) {}

  createOneToOne = async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "userId is required" });
        return;
      }

      const currentUserId = (req as any).user?.userId;

      if (!currentUserId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const conversation = await this.conversationService.createOneToOne(
        userId,
        currentUserId
      );
      res
        .status(HttpStatus.CREATED)
        .json({ success: true, data: conversation });
    } catch (err) {
      console.log(err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to create conversation" });
    }
  };

  findOneToOne = async (req: Request, res: Response) => {
    try {
      const { userA, userB } = req.params;
      const conversation = await this.conversationService.findOneToOne(
        userA,
        userB
      );
      res.status(HttpStatus.OK).json({ success: true, data: conversation });
    } catch (err) {
      console.log(`Err in findUser : ${err}`);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to find conversation" });
    }
  };

  findConversation = async (req: Request, res: Response) => {
    try {
      const { conversationId } = req.params;
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const conversation = await this.conversationService.findConversation(
        conversationId,
        userId
      );
      res.status(HttpStatus.OK).json({ success: true, data: conversation });
    } catch (err) {
      console.log(`Err in findConversationById : ${err}`);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to find conversation" });
    }
  };

  findConversationByUser = async (req: Request, res: Response) => {
    try {
      const currentUserId = (req as any).user?.userId;

      if (!currentUserId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const userId = req.params.id === "me" ? currentUserId : req.params.id;
      if (!userId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "UserId Not Provided" });
        return;
      }
      const conversation = await this.conversationService.findConversations(userId,req.query);
      res.status(HttpStatus.OK).json({ success: true, data: conversation });
    } catch (err) {
      console.log(`Err in findConversationByUser : ${err}`);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to find conversation" });
    }
  };

  findConversationByGroup = async (req: Request, res: Response) => {
    try {
      const { groupId } = req.params;
      if (!groupId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "GroupId Not Provided" });
        return;
      }
      const conversation =
        await this.conversationService.findConversationByGroup(groupId);
      res.status(HttpStatus.OK).json({ success: true, data: conversation });
    } catch (err) {
      console.log(`Err in findConversation Group : ${err}`);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to find conversation" });
    }
  };

  setTypingUser = async (req: Request, res: Response) => {
    try {
      const { conversationId, userId } = req.body;
      const updated = await this.conversationService.setTypingUser(
        conversationId,
        userId
      );
      res.status(HttpStatus.OK).json({ success: true, data: updated });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to set typing user" });
    }
  };

  removeTypingUser = async (req: Request, res: Response) => {
    try {
      const { conversationId, userId } = req.body;
      const updated = await this.conversationService.removeTypingUser(
        conversationId,
        userId
      );
      res.status(HttpStatus.OK).json({ success: true, data: updated });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to remove typing user" });
    }
  };

  getTypingUsers = async (req: Request, res: Response) => {
    try {
      const { conversationId } = req.params;
      const users = await this.conversationService.getTypingUsers(
        conversationId
      );
      res.status(HttpStatus.OK).json({ success: true, data: users });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to get typing users" });
    }
  };
}
