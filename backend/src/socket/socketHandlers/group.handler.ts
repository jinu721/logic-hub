import { Server } from "socket.io";
import {
  ExtendedSocket,
  GroupUpdateData,
  VoiceRoomData,
} from "../../types/socket.types";
import { AppContainer } from "../../utils/app.container";
import { generateSystemMessage } from "../../utils/generate.message";
import { Types } from "mongoose";

export class GroupHandler {
  constructor(private io: Server) {}

  public setupGroupHandlers(socket: ExtendedSocket): void {
    socket.on("update_group", this.handleUpdateGroup.bind(this, socket));
    socket.on("host-voice-room", this.handleHostVoiceRoom.bind(this, socket));
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

      let updatedConversation;
      let finalConversationId = conversationId;
      let finalUserId = userId;
      let finalNewGroupData = newGroupData;

      switch (type) {
        case "add_members":
          updatedConversation = await AppContainer.groupService.addMembers(
            groupId,
            members || []
          );
          break;
        case "remove_member":
          updatedConversation = await AppContainer.groupService.removeMember(
            groupId,
            removeMember || ""
          );
          break;
        case "make_admin":
          updatedConversation = await AppContainer.groupService.makeAdmin(
            conversationId,
            groupId,
            userId || ""
          );
          break;
        case "remove_admin":
          updatedConversation = await AppContainer.groupService.removeAdmin(
            conversationId,
            groupId,
            userId || ""
          );
          break;
        case "edit_group_info":
          updatedConversation = await AppContainer.groupService.updateGroupInfo(
            conversationId,
            groupId,
            newGroupData
          );
          break;
        case "leave_group":
          updatedConversation = await AppContainer.groupService.leaveGroup(
            conversationId,
            groupId,
            userId || ""
          );
          break;
        case "delete_group":
          updatedConversation = await AppContainer.groupService.deleteGroup(
            groupId
          );
          break;
        case "join_group":
          console.log("JOIN GROUP");
          const data = await AppContainer.groupService.sendJoinRequest(
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
            await AppContainer.groupService.acceptJoinRequest(
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
              .emit("recive_message", {conversationId:systemMsg.conversationId, message: systemMsg});
          }

          const updatedGroup = await AppContainer.groupService.findGroupById(
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

  private async handleHostVoiceRoom(
    socket: ExtendedSocket,
    { groupId, roomData }: VoiceRoomData
  ): Promise<void> {
    try {
      await AppContainer.groupService.updateGroup(groupId, {
        voiceRoom: roomData,
      });
      socket.emit("voice-room-created", "Thanks");
    } catch (err) {
      console.log("Error creating voice room:", err);
    }
  }
}
