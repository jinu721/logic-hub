import { PublicConversationDTO, PublicGroupDTO } from "@modules/chat/dtos"

export interface IGroupMemberService {
  addMembers(groupId: string, memberIds: string[]): Promise<PublicConversationDTO | null>
  removeMember(groupId: string, userId: string): Promise<PublicConversationDTO | null>
  makeAdmin(conversationId: string, groupId: string, userId: string): Promise<PublicConversationDTO | null>
  removeAdmin(conversationId: string, groupId: string, userId: string): Promise<PublicConversationDTO | null>
  sendJoinRequest(groupId: string, userId: string): Promise<{
    updatedConversation: PublicConversationDTO | null;
    userId: string;
    conversationId: any;
    newGroupData: PublicGroupDTO;
  }>
  acceptJoinRequest(conversationId: string, groupId: string, userId: string): Promise<PublicConversationDTO | null>
  leaveGroup(conversationId: string, groupId: string, userId: string): Promise<PublicConversationDTO | null>
}
