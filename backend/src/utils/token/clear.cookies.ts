import { Response } from "express";
import { getCookieOptions } from "./cookie.options";

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken", getCookieOptions());
  res.clearCookie("refreshToken", getCookieOptions());
};