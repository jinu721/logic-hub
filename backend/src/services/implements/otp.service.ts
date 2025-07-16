import { OtpRepository } from "../../repository/implements/otp.repository";
import { generateOTP } from "../../utils/generate.otp";

export class OTPServices {
    constructor(private otpRepo: OtpRepository) {}

    async generateOrUpdateOTP(email: string) {
        const otp = generateOTP();
        await this.otpRepo.upsert(email, otp);
        return otp;
    }

    async findOTPByEmail(email: string) {
        return await this.otpRepo.getByEmail(email);
    }

    async verifyOTP(email: string, otp: string) {
        const otpRecord = await this.otpRepo.getByEmail(email);
        if (!otpRecord) throw new Error("Invalid OTP");
        if (otpRecord.otp !== otp) throw new Error("Incorrect OTP");
        return true;
    }
}
