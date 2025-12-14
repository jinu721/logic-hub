import { PublicUserDTO } from "@modules/user/dtos";
import { UpdateUserInput, UserDocument } from "@shared/types";

export interface IUserCommandService {
  findUserByIdAndUpdate(id: string, data: Partial<UserDocument>): Promise<PublicUserDTO>;
  updateUser(userId: string, data: UpdateUserInput): Promise<PublicUserDTO>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<PublicUserDTO>;
  toggleUserNotification(userId: string): Promise<PublicUserDTO>;
  toggleBanStatus(userId: string): Promise<{ isBanned: boolean }>;
}
