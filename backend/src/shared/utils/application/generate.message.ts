import { Container } from "@di";
import { Types } from "mongoose";
import { MessageIF } from "@shared/types"; 

export type SystemMessageType =
  | "add_members"
  | "remove_member"
  | "make_admin"
  | "remove_admin"
  | "edit_group_info"
  | "leave_group"
  | "delete_group"
  | "join_group"
  | "approve_group";

interface GroupUpdateData {
  name?: string;
  description?: string;
  image?: string;
}

export const generateSystemMessage = async (
  container: Container,
  type: SystemMessageType,
  conversationId: string,
  userId: string,
  members: string[],
  newGroupData?: GroupUpdateData,
  removeMemberId?: string
): Promise<MessageIF | null> => {
  const actingUser = await container.userQuerySvc.findUserById(userId);
  if (!actingUser) return null;

  let removedMemberName = "";
  if (removeMemberId) {
    const removedUser = await container.userQuerySvc.findUserById(removeMemberId);
    removedMemberName = removedUser?.username ?? "";
  }

  const memberUsers = await Promise.all(
    members.map((id) => container.userQuerySvc.findUserById(id))
  );
  const memberNames = memberUsers.map((u) => u.username).join(", ");

  let content: string;

  switch (type) {
    case "add_members":
      content = `${actingUser.username} added ${memberNames} to the group`;
      break;

    case "remove_member":
      content = `${actingUser.username} removed ${removedMemberName} from the group`;
      break;

    case "make_admin":
      content = `${actingUser.username} became an admin`;
      break;

    case "remove_admin":
      content = `${actingUser.username} is no longer an admin`;
      break;

    case "edit_group_info":
      content = `${actingUser.username} changed group name to '${newGroupData?.name}'`;
      break;

    case "leave_group":
      content = `${actingUser.username} left the group`;
      break;

    case "delete_group":
      content = `${actingUser.username} deleted the group`;
      break;

    case "join_group":
    case "approve_group":
      content = `${actingUser.username} joined the group`;
      break;

    default:
      return null;
  }

  const systemMessage: MessageAttrs = {
    sender: new Types.ObjectId(), 
    conversationId: new Types.ObjectId(conversationId),
    type: "system",
    content,
    mentionedUsers: [],
    seenBy: [],
    isEdited: false,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return await container.messageCommandSvc.createMessage(systemMessage, null);
};
