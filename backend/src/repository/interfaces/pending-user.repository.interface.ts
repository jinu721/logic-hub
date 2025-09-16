import { PendingUserIF } from "../../types/pending-user.types";

export interface IPendingUserRepository {
  createPendingUser(
    pendingUser: {username:string,email:string,password:string,otp:number}
  ): Promise<any>;
  findPendingUserByEmail(email: string): Promise<PendingUserIF | null>;
  deletePendingUser(email: string): Promise<any>;
  updatePendingUserOtp(email: string, otp: number): Promise<any>;
}
