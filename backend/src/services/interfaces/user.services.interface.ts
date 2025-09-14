import { PublicUserDTO } from "../../mappers/user.dto";
import { UserIF } from "../../types/user.types";

export interface IUserService {
  register(username: string, email: string, password: string): Promise<{ email: string }>;
  verifyOTP(email: string, otp: string): Promise<PublicUserDTO | null>;
  verifyLogin(token: string): Promise<{ accessToken: string; refreshToken: string, userId: string }>;
  login(emailOrUsername: string, password: string): Promise<{ accessToken: string; refreshToken: string, userId: string }>;
  forgotPassword(email: string): Promise<{ message: string }>;
  resetPassword(userId: string, password: string): Promise<void>;
  findUserById(id: string): Promise<PublicUserDTO | null>;
  findUserByIdAndUpdate(id: string, data: Partial<UserIF>): Promise<PublicUserDTO | null>;
  findUsers(search: string,page: number,limit: number): Promise<{users:PublicUserDTO[],totalItems:number}>;
  giftItem(userId: string, itemId: string, type: string): Promise<any>;
  searchUsers(search: string): Promise<PublicUserDTO[] | null>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<PublicUserDTO | null>;
  updateUser(userId: string, data: Partial<UserIF>): Promise<PublicUserDTO | null>;
  toggleBanStatus(userId: string): Promise<{ isBanned: boolean }>;
  findByEmailOrUsername(value: string): Promise<boolean>;
  findUserByName(username: string,currentUserId:string): Promise<PublicUserDTO | null>;
  setUserOnline(userId: string, isOnline: boolean): Promise<PublicUserDTO | null>;
  resendOtp(email: string): Promise<void>; 
  toggleUserNotification(userId: string): Promise<PublicUserDTO | null>;
  cancelMembership(userId: string): Promise<boolean>;
  claimDailyReward(userId: string): Promise<PublicUserDTO>;
}
