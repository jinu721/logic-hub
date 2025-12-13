import { PublicUserDTO } from "@modules/user/dtos";
import { UserDocument } from "@modules/user/models";

export interface IUserQueryService {
  findByEmailOrUsername(value: string): Promise<boolean>;
  getUserByEmail(email: string): Promise<PublicUserDTO>;
  findUserById(id: string): Promise<PublicUserDTO>;
  findUserByName(username: string, currentUserId: string): Promise<PublicUserDTO>;
  findUsers(search: string, page: number, limit: number): Promise<{ users: PublicUserDTO[], totalItems: number }>;
  searchUsers(search: string): Promise<PublicUserDTO[]>;
}
