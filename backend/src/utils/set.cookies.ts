import { Response } from "express";
import { env } from "../config/env";

export const setAccessToken = (res: Response, token: string) => {
  res.cookie("accessToken", token, {
    httpOnly: true, 
    secure: env.NODE_ENV === "production", 
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: env.NODE_ENV === "production" ? ".jinu.site" : undefined,
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export const setRefreshToken = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: env.NODE_ENV === "production" ? ".jinu.site" : undefined,
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

