import { container } from "../../di/container";
const userService = container.userSvc;


const messageService = container.messageSvc;


export const generateSystemMessage = async (
  type: string,
  conversationId: string,
  userId: string,
  members: string[],
  newGroupData: any,
  removeMember: string
) => {
  let content = "";
  const actingUser = await userService.findUserById(userId);
  console.log("ActingUser:- ", type);
  if (!actingUser) {
    console.error("actingUser is null");
    return;
  }

  let removedMember;
  if (removeMember) {
    removedMember = await userService.findUserById(removeMember);
  }

  const memberUsers = await Promise.all(
    members?.map((id) => userService.findUserById(id))
  );

  switch (type) {
    case "add_members":
      const addedNames = memberUsers.map((user) => user.username).join(", ");
      content = `${actingUser.username} added ${addedNames} to the group`;
      break;
    case "remove_member":
      content = `${actingUser.username} remove ${removedMember?.username} from the group`;
      break;
    case "make_admin":
      content = `${actingUser.username} became an admin`;
      break;
    case "remove_admin":
      content = `${actingUser.username} is no longer an admin`;
      break;
    case "edit_group_info":
      content = `${actingUser.username} changed group name to '${newGroupData.name}'`;
      break;
    case "leave_group":
      content = `${actingUser.username} left the group`;
      break;
    case "delete_group":
      content = `${actingUser.username} deleted the group`;
      break;
    case "join_group":
      content = `${actingUser.username} joined to the group`;
      break;
    case "approve_group":
      content = `${actingUser.username} joined to the group`;
      break;

    default:
      return null;
  }

  const systemMessageData = {
    sender: "system",
    conversationId,
    type: "system",
    content,
  } as any;


  return await messageService.createMessage(systemMessageData, null);
};
