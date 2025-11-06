import { PublicUserDTO } from "@modules/user/dtos";

export interface IUserQueryService {
  findByEmailOrUsername(value: string): Promise<boolean>;
  findUserById(id: string): Promise<PublicUserDTO>;
  findUserByName(username: string, currentUserId: string): Promise<PublicUserDTO>;
  findUsers(search: string, page: number, limit: number): Promise<{ users: PublicUserDTO[], totalItems: number }>;
  searchUsers(search: string): Promise<PublicUserDTO[]>;
}
