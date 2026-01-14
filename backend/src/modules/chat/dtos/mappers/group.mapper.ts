import { toPublicUserDTO, toPublicUserDTOs, PublicUserDTO } from "@modules/user/dtos";
import { PublicGroupDTO } from "@modules/chat/dtos";
import { GroupDocument, GroupIF, PopulatedUser } from "@shared/types";
import { Types } from "mongoose";

const isPopulatedUser = (user: unknown): user is PopulatedUser => {
  return user !== null && typeof user === 'object' && 'username' in user;
};

export const toPublicGroupDTO = (group: GroupDocument): PublicGroupDTO => {
  return {
    _id: group._id ? group._id.toString() : "",
    name: group.name,
    description: group.description,
    image: group.image,
    createdBy: isPopulatedUser(group.createdBy) ? toPublicUserDTO(group.createdBy) : {} as PublicUserDTO,
    admins: Array.isArray(group.admins) && group.admins.length > 0 && isPopulatedUser(group.admins[0])
      ? toPublicUserDTOs(group.admins as unknown as PopulatedUser[])
      : [],
    members: Array.isArray(group.members) && group.members.length > 0 && isPopulatedUser(group.members[0])
      ? toPublicUserDTOs(group.members as unknown as PopulatedUser[])
      : [],
    groupType: group.groupType,
    category: group.category || "General",
    tags: group.tags || [],
    userRequests: Array.isArray(group.userRequests) && group.userRequests.length > 0 && isPopulatedUser(group.userRequests[0])
      ? toPublicUserDTOs(group.userRequests as unknown as PopulatedUser[])
      : [],
    isDeleted: group.isDeleted,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
  };
};;

export const toPublicGroupDTOs = (groups: GroupIF[]): PublicGroupDTO[] => {
  return groups.map(toPublicGroupDTO);
};
