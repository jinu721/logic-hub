import { Server } from "socket.io";
import {
  ExtendedSocket,
  GroupUpdateData,
} from "../../shared/types/socket.types";
import { generateSystemMessage } from "../../shared/utils/application/generate.message";
import { Types } from "mongoose";
import { Container } from "@di";
import { UpdateGroupInfoInput } from "@shared/types";
import { PublicConversationDTO } from "@modules/chat";

export class GroupHandler {
  constructor(private io: Server, private container: Container) { }

  public setupGroupHandlers(socket: ExtendedSocket): void {
    socket.on("update_group", this.handleUpdateGroup.bind(this, socket));
    socket.on(
      "join_conversation",
      this.handleJoinConversation.bind(this, socket)
    );
  }

  private async handleJoinConversation(
    socket: ExtendedSocket,
    conversationId: string
  ): Promise<void> {
    socket.join(conversationId);
  }

  private async handleUpdateGroup(
    socket: ExtendedSocket,
    {
      type,
      conversationId,
      groupId,
      members,
      userId,
      newGroupData,
      removeMember,
    }: GroupUpdateData
  ): Promise<void> {
    try {

      console.log("Group Update Data:-", type, conversationId, groupId, members, userId, newGroupData, removeMember);

      let updatedConversation: PublicConversationDTO | null = null;

      let finalConversationId = conversationId;
      let finalUserId = userId;
      let finalNewGroupData;

      switch (type) {
        case "add_members":
          updatedConversation = await this.container.groupMemberSvc.addMembers(
            groupId,
            members || []
          );
          break;
        case "remove_member":
          updatedConversation = await this.container.groupMemberSvc.removeMember(
            groupId,
            removeMember || ""
          );
          break;
        case "make_admin":
          updatedConversation = await this.container.groupMemberSvc.makeAdmin(
            conversationId,
            groupId,
            userId || ""
          );
          break;
        case "remove_admin":
          updatedConversation = await this.container.groupMemberSvc.removeAdmin(
            conversationId,
            groupId,
            userId || ""
          );
          break;
        case "edit_group_info":
          let editedGroupDocument: UpdateGroupInfoInput = {
            name: newGroupData?.name,
            description: newGroupData?.description,
            image: newGroupData?.image,
            members: newGroupData?.members,
            admins: newGroupData?.admins,
            groupType: newGroupData?.groupType,
            userRequests: newGroupData?.userRequests,
          };
          updatedConversation = await this.container.groupCommandSvc.updateGroupInfo(
            conversationId,
            groupId,
            editedGroupDocument
          );
          break;
        case "leave_group":
          updatedConversation = await this.container.groupMemberSvc.leaveGroup(
            conversationId,
            groupId,
            userId || ""
          );
          break;
        case "delete_group":
          updatedConversation = await this.container.groupCommandSvc.deleteGroup(
            groupId
          );
          break;
        case "join_group":
          console.log("JOIN GROUP");
          const data = await this.container.groupMemberSvc.sendJoinRequest(
            groupId,
            userId || ""
          );
          console.log("Data After Join", data);
          finalConversationId = String(data.conversationId);
          finalUserId = data.userId;
          finalNewGroupData = data.newGroupData;
          updatedConversation = data.updatedConversation;
          break;
        case "approve_group":
          updatedConversation =
            await this.container.groupMemberSvc.acceptJoinRequest(
              conversationId,
              groupId,
              userId || ""
            );
          break;
        default:
          throw new Error("Invalid group update type");
      }

      if (
        updatedConversation &&
        finalConversationId &&
        Types.ObjectId.isValid(finalConversationId.toString())
      ) {
        try {
          const systemMsg = await generateSystemMessage(
            this.container,
            type,
            finalConversationId,
            finalUserId as string,
            members as string[],
            finalNewGroupData,
            removeMember as string
          );


          if (systemMsg) {
            this.io
              .to(finalConversationId.toString())
              .emit("receive_message", { conversationId: systemMsg.conversationId, message: systemMsg });
          }

          const updatedGroup = await this.container.groupQuerySvc.findGroupById(
            groupId
          );

          this.io.to(finalConversationId.toString()).emit("group_updated", {
            conversationId: finalConversationId,
            updatedMembers: updatedConversation.participants,
            groupInfo: updatedGroup,
            removeMember,
            type,
          });
        } catch (socketErr) {
          console.error("Socket room/message error:", socketErr);
          socket.emit("send_error", {
            message: "Group updated but failed to emit socket events.",
          });
        }
      } else {
        console.warn("No conversation update or invalid conversation ID");
      }
    } catch (err) {
      console.error("Socket Error in handleUpdateGroup:", err);
      socket.emit("send_error", {
        message:
          err instanceof Error
            ? err.message
            : "Unexpected error during group update",
      });
    }
  }

}
