import { sendEmail } from "@utils/application";
import { IEmailProvider } from "./email.sender.interface";

export class EmailProvider implements IEmailProvider {
  async sendOTP(email: string, otp: number): Promise<void> {
    await sendEmail({
      to: email,
      subject: "Verify your account",
      content: `Your OTP is: ${otp}`,
      type: "otp",
    });
  }

  async sendLink(email: string, link: string): Promise<void> {
    await sendEmail({
      to: email,
      subject: `A new link for you`,
      content: `Click here to verify your email: ${link}`,
      type: "link",
    });
  }
}
