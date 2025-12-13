import { PendingUserIF } from "@shared/types";

export interface IPendingUserRepository {
  createPendingUser(
    pendingUser: { username: string, email: string, password: string, otp: number }
  ): Promise<PendingUserIF>;
  findPendingUserByEmail(email: string): Promise<PendingUserIF | null>;
  deletePendingUser(email: string): Promise<boolean>;
  updatePendingUserOtp(email: string, otp: number): Promise<PendingUserIF | null>;
}
