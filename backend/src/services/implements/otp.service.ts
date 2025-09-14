import { IOtpRepository } from "../../repository/interfaces/otp.repository.interface";
import { generateOTP } from "../../utils/application/generate.otp";
import { IOTPService } from "../interfaces/otp.services.interface";

export class OTPServices implements IOTPService {
    constructor(private readonly _otpRepo: IOtpRepository) {}

    async generateOrUpdateOTP(email: string) {
        const otp = generateOTP();
        await this._otpRepo.upsert(email, otp);
        return otp;
    }

    async findOTPByEmail(email: string) {
        return await this._otpRepo.getByEmail(email);
    }

    async verifyOTP(email: string, otp: string) {
        const otpRecord = await this._otpRepo.getByEmail(email);
        if (!otpRecord) throw new Error("Invalid OTP");
        if (otpRecord.otp !== otp) throw new Error("Incorrect OTP");
        return true;
    }
}
