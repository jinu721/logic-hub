import { PublicUserDTO } from "@modules/user/dtos";
import { UserIF } from "@shared/types";

export interface IUserCommandService {
  findUserByIdAndUpdate(id: string, data: Partial<UserIF>): Promise<PublicUserDTO>;
  updateUser(userId: string, data: Partial<UserIF>): Promise<PublicUserDTO>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<PublicUserDTO>;
  toggleUserNotification(userId: string): Promise<PublicUserDTO>;
  toggleBanStatus(userId: string): Promise<{ isBanned: boolean }>;
}
