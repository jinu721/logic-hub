import { PublicUserDTO } from "@modules/user/dtos";

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
