import jwt from "jsonwebtoken";
import { UserIF } from "../types/user.types";
import { PublicUserDTO } from "../mappers/user.dto";

export const generateAccessToken = (user: PublicUserDTO) => {
  const payload = {
    userId: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
    isBanned: user.isBanned,
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
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

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "30d",
  });
};

export const generateLinkToken = (user: PublicUserDTO) => {
  const payload = {
    userId: user._id,
    email: user.email,
  };

  return jwt.sign(payload, process.env.VERIFY_TOKEN_SECRET as string, {
    expiresIn: "10m",
  });
};
