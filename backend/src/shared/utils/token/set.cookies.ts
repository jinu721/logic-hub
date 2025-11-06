import { Response } from "express";
import { getCookieOptions } from "./cookie.options";

export const setAccessToken = (res: Response, token: string) => {
  res.cookie("accessToken", token, getCookieOptions(24 * 60 * 60 * 1000));
};

export const setRefreshToken = (res: Response, token: string) => {
  res.cookie("refreshToken", token, getCookieOptions(7 * 24 * 60 * 60 * 1000));
};
