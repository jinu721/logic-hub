export interface IOTPServices {
    generateOrUpdateOTP(email: string): Promise<number>;
    findOTPByEmail(email: string): Promise<{ email: string; otp: number } | null>;
    verifyOTP(email: string, otp: string): Promise<boolean>;
}
