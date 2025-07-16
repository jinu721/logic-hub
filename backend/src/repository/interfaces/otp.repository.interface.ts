import { OtpIF } from "../../types/user.types";

export interface IOtpRepository {
    upsert(email: string, otp: number): Promise<OtpIF>;
    getByEmail(email: string): Promise<OtpIF | null>;
    getByEmailAndCode(email: string, otp: number): Promise<OtpIF | null>;
}
