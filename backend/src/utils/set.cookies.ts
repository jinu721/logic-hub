import { Response } from "express";

export const setAccessToken = (res: Response, token: string) => {
  res.cookie("accessToken", token, {
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    // domain:".jinu.site",
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export const setRefreshToken = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    // domain:".jinu.site",
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  });
};
