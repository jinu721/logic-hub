export interface IEmailProvider {
  sendOTP(email: string, otp: number): Promise<void>;
  sendLink(email: string, link: string): Promise<void>;
}