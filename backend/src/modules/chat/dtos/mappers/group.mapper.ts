import { toPublicUserDTO, toPublicUserDTOs } from "@modules/user/dtos";
import { PublicGroupDTO } from "@modules/chat/dtos";
import { GroupDocument } from "@shared/types";



export const toPublicGroupDTO = (group: GroupDocument): PublicGroupDTO => {
  return {
    _id: group._id ? group._id.toString() : "",
    name: group.name,
    description: group.description,
    image: group.image,
    createdBy: group.createdBy ? toPublicUserDTO(group.createdBy as any) : {},
    admins: group.admins ? toPublicUserDTOs(group.admins as any) : [],
    members: group.members ? toPublicUserDTOs(group.members as any) : [],
    groupType: group.groupType,
    userRequests: group.userRequests as any,
    isDeleted: group.isDeleted,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
  };
};;

export const toPublicGroupDTOs = (groups: GroupIF[]): PublicGroupDTO[] => {
  return groups.map(toPublicGroupDTO);
};
