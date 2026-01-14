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
exports.EmailProvider = void 0;
const application_1 = require("../../utils/application");
class EmailProvider {
    sendOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, application_1.sendEmail)({
                to: email,
                subject: "Verify your account",
                content: `Your OTP is: ${otp}`,
                type: "otp",
            });
        });
    }
    sendLink(email, link) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, application_1.sendEmail)({
                to: email,
                subject: `A new link for you`,
                content: `Click here to verify your email: ${link}`,
                type: "link",
            });
        });
    }
}
exports.EmailProvider = EmailProvider;
