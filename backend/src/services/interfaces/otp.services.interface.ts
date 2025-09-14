import { OtpIF } from "../../types/user.types";

export interface IOTPService {
    generateOrUpdateOTP(email: string): Promise<number>;
    findOTPByEmail(email: string): Promise<OtpIF | null>;
    verifyOTP(email: string, otp: string): Promise<boolean>;
}
