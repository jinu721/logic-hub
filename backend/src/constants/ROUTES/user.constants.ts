import { COMMON_ROUTES } from "./commen.routes";

export const USER_ROUTES = {
  BASE: COMMON_ROUTES.BASE,
  CHECK_USER: "/check-user",
  RESEND_OTP: "/resend-otp",
  VERIFY_ADMIN: "/verify-admin",
  ME: COMMON_ROUTES.ME,     
  UPDATE_ME: COMMON_ROUTES.ME, 
  BY_USERNAME: "/:username",
  BAN_USER: "/:userId/ban",
  GIFT_ITEM: "/:userId/gift/:type",
  CANCEL_MEMBERSHIP: "/membership/cancel",
  CLAIM_DAILY_REWARD: "/daily-reward/claim",
};