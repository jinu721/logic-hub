import OTP from "../../models/otp.model";
import { IOtpRepository } from "../interfaces/otp.repository.interface";
import { OtpIF } from "../../types/user.types";

export class OtpRepository implements IOtpRepository {
    async upsert(email: string, otp: number): Promise<OtpIF> {
        return OTP.findOneAndUpdate(
            { email },
            { otp },
            { upsert: true, new: true }
        );
    }

    async getByEmail(email: string): Promise<OtpIF | null> {
        return OTP.findOne({ email });
    }

    async getByEmailAndCode(email: string, otp: number): Promise<OtpIF | null> {
        return OTP.findOne({ email, otp });
    }
}
