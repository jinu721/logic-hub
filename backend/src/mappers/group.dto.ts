import { GroupIF } from "../shared/types/group.types";
import { PublicUserDTO, toPublicUserDTO, toPublicUserDTOs } from "./user.dto";

export interface PublicGroupDTO {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  createdBy: PublicUserDTO;
  admins: PublicUserDTO[];
  members: PublicUserDTO[];
  groupType: 'public-open' | 'public-approval';
  userRequests: PublicUserDTO[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}



export const toPublicGroupDTO = (group: GroupIF): PublicGroupDTO => {
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
