import jwt from "jsonwebtoken";
import { PublicUserDTO } from "../../../mappers/user.dto";
import { env } from "../../../config/env";

export const generateAccessToken = (user: PublicUserDTO) => {
  const payload = {
    userId: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
    isBanned: user.isBanned,
  };

  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "2d",
  });
};

export const generateRefreshToken = (user: PublicUserDTO) => {
  const payload = {
    userId: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
    isBanned: user.isBanned,
  };

  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "30d",
  });
};

export const generateLinkToken = (user: PublicUserDTO) => {
  const payload = {
    userId: user._id,
    email: user.email,
  };

  return jwt.sign(payload, env.VERIFY_TOKEN_SECRET as string, {
    expiresIn: "10m",
  });
};
