import { COMMON_ROUTES } from "./commen.routes";

export const AUTH_ROUTES = {
  REGISTER: "/register",
  VERIFY_OTP: "/verify-otp",
  LOGIN: "/login",
  VERIFY_LOGIN: "/verify-login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  REFRESH_TOKEN: "/refresh-token",
  CHANGE_PASSWORD: "/change-password",
  ME: COMMON_ROUTES.ME, 
  LOGOUT: "/logout",
  CLEAR_COOKIES: "/clear-cookies",
  GOOGLE: "/google",
  GOOGLE_CALLBACK: "/google/callback",
  GITHUB: "/github",
  GITHUB_CALLBACK: "/github/callback",
};
