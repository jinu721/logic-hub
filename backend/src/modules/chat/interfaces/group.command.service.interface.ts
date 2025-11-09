import { PublicGroupDTO } from "@modules/chat/dtos"

export interface IGroupCommandService {
  createGroup(data: any, imageBuffer?: Buffer, userId?: string): Promise<PublicGroupDTO>
  updateGroup(groupId: string, data: any): Promise<PublicGroupDTO | null>
  deleteGroup(groupId: string): Promise<any> 
  updateGroupInfo(conversationId: string, groupId: string, data: any): Promise<any>
}
