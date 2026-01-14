"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const env_1 = require("../../../config/env");
const mailer_config_1 = require("../../../config/mailer.config");
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, content, type, link }) {
    let emailBody = "";
    let emailTitle = "";
    switch (type) {
        case "otp":
            emailTitle = "Verify Your Account";
            emailBody = `
                <p>We received a request to verify your account. Your One-Time Password (OTP) is:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <div style="display: inline-block; background-color: #edf2f7; border: 1px dashed #cbd5e0; border-radius: 6px; padding: 15px 30px;">
                        <span style="font-family: 'Courier New', monospace; font-size: 28px; font-weight: bold; color: #3182ce; letter-spacing: 5px;">${content}</span>
                    </div>
                </div>
                <p style="text-align: center;">This code will expire in 10 minutes.</p>
            `;
            break;
        case "link":
            emailTitle = "Important Link for You";
            emailBody = `
                <p>${content}</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${link}" style="display: inline-block; padding: 14px 30px; font-size: 16px; font-weight: 600; color: #ffffff; background-color: #4299e1; text-decoration: none; border-radius: 6px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;">Click Here</a>
                </div>
            `;
            break;
        case "announcement":
            emailTitle = "Important Announcement";
            emailBody = `<p>${content}</p>`;
            break;
    }
    const emailHTML = `
        <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://yourwebsite.com/logo.png" alt="Company Logo" style="max-height: 60px;">
            </div>
            <div style="background-color: #f8f9fa; border-radius: 6px; padding: 25px; margin-bottom: 25px;">
                <h1 style="color: #2d3748; font-size: 24px; margin-top: 0; margin-bottom: 20px; text-align: center;">${emailTitle}</h1>
                ${emailBody}
            </div>
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #718096; font-size: 14px; margin-bottom: 10px;">Best regards,<br>Your Company Team</p>
                <p style="color: #a0aec0; font-size: 12px; margin-top: 15px;">© ${new Date().getFullYear()} Your Company. All rights reserved.<br>123 Business Street, City, Country</p>
            </div>
        </div>
    `;
    yield mailer_config_1.transporter.sendMail({
        from: env_1.env.EMAIL_USER,
        to,
        subject,
        html: emailHTML,
    });
});
exports.sendEmail = sendEmail;
