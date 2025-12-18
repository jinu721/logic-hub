import { toPublicUserDTO, toPublicUserDTOs } from "@modules/user/dtos";
import { PublicGroupDTO } from "@modules/chat/dtos";
import { GroupDocument } from "@shared/types";



export const toPublicGroupDTO = (group: GroupDocument): PublicGroupDTO => {
  return {
    _id: group._id ? group._id.toString() : "",
    name: group.name,
    description: group.description,
    image: group.image,
    createdBy: group.createdBy ? toPublicUserDTO(group.createdBy) : {},
    admins: group.admins ? toPublicUserDTOs(group.admins) : [],
    members: group.members ? toPublicUserDTOs(group.members) : [],
    groupType: group.groupType,
    userRequests: group.userRequests,
    isDeleted: group.isDeleted,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
  };
};;

export const toPublicGroupDTOs = (groups: GroupIF[]): PublicGroupDTO[] => {
  return groups.map(toPublicGroupDTO);
};
