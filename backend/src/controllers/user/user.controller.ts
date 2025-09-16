import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUserController } from "./user.controller.interface";
import { IUserService } from "../../services/interfaces/user.services.interface";
import { ITokenService } from "../../services/interfaces/token.service.interface";
import { HttpStatus } from "../../constants/http.status";
import { sendSuccess } from "../../utils/application/response.util";
import { asyncHandler } from "../../utils/application/async.handler";
import { AppError } from "../../utils/application/app.error";
import { env } from "../../config/env";
import { RedisHelper } from "../../utils/database/redis.util";

export class UserController implements IUserController {
  constructor(
    private readonly _userSvc: IUserService,
    private readonly _tokenSvc: ITokenService
  ) {}

  findUser = asyncHandler(async (req: Request, res: Response) => {
    const { type, value } = req.body;
    if (!type || !value) throw new AppError(HttpStatus.BAD_REQUEST, "Type and value are required");

    const user = await this._userSvc.findByEmailOrUsername(value);
    sendSuccess(res, HttpStatus.OK, { user, status: !!user });
  });

  getUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const { username } = req.params;
    if (!username) throw new AppError(HttpStatus.BAD_REQUEST, "Username is required");

    const user = await this._userSvc.findUserByName(username, userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User Not Found");

    sendSuccess(res, HttpStatus.OK, { user });
  });

  cancelMembership = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const user = await this._userSvc.cancelMembership(userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User Not Found");

    sendSuccess(res, HttpStatus.OK, { user });
  });

  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const user = await this._userSvc.findUserById(userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User Not Found");

    sendSuccess(res, HttpStatus.OK, { user, status: true });
  });

  updateCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies.accessToken;
    if (!token) throw new AppError(HttpStatus.UNAUTHORIZED, "No token found in cookies");

    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET!) as { userId: string };
    const { avatar, banner, ...otherData } = req.body.userData || {};

    const user = await this._userSvc.findUserByIdAndUpdate(decoded.userId, {
      ...otherData,
      avatar: avatar || null,
      banner: banner || null,
    });

    sendSuccess(res, HttpStatus.OK, { user }, "User updated successfully");
  });

  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const { search, page, limit } = req.query;
    if (!search || !page || !limit) throw new AppError(HttpStatus.BAD_REQUEST, "Missing required query parameters");

    const users = await this._userSvc.findUsers(search as string, Number(page), Number(limit));
    sendSuccess(res, HttpStatus.OK, { users });
  });

  toggleBan = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    if (!userId) throw new AppError(HttpStatus.BAD_REQUEST, "User ID is required");

    const result = await this._userSvc.toggleBanStatus(userId);

    if (result.isBanned) {
      const tokenData = await this._tokenSvc.getTokenByUserId(userId);
      const token = tokenData?.accessToken;
      if (token) {
        const decoded = jwt.decode(token) as jwt.JwtPayload;
        if (decoded?.exp) {
          const expiry = decoded.exp - Math.floor(Date.now() / 1000);
          RedisHelper.set(`blacklist_${token}`, "true", expiry);
        }
      }
    }

    sendSuccess(res, HttpStatus.OK, { result }, "User ban status toggled");
  });

  giftItem = asyncHandler(async (req: Request, res: Response) => {
    const { userId, type } = req.params;
    const { itemId } = req.body;

    if (!itemId || !userId || !type) throw new AppError(HttpStatus.BAD_REQUEST, "Item ID, User ID and Type are required");

    const result = await this._userSvc.giftItem(userId, itemId, type);
    if (!result) throw new AppError(HttpStatus.BAD_REQUEST, "Error gifting item");

    sendSuccess(res, HttpStatus.OK, { result }, `Gifted ${type} successfully`);
  });

  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) throw new AppError(HttpStatus.BAD_REQUEST, "Email is required");

    const result = await this._userSvc.resendOtp(email);
    sendSuccess(res, HttpStatus.OK, result, "OTP resent successfully");
  });

  claimDailyReward = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new AppError(HttpStatus.BAD_REQUEST, "User ID is required");

    const updatedUser = await this._userSvc.claimDailyReward(userId);
    if (!updatedUser) throw new AppError(HttpStatus.BAD_REQUEST, "Error claiming daily reward");

    sendSuccess(
      res,
      HttpStatus.OK,
      {
        message: "Daily reward claimed!",
        dailyRewardDay: updatedUser.dailyRewardDay,
        lastRewardClaimDate: updatedUser.lastRewardClaimDate,
      },
      "Daily reward claimed successfully"
    );
  });

  verifyAdmin = asyncHandler(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new AppError(HttpStatus.BAD_REQUEST, "Token missing");

    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET!) as { role: string };
    if (!decoded || decoded.role !== "admin") throw new AppError(HttpStatus.FORBIDDEN, "Only admins allowed");

    sendSuccess(res, HttpStatus.OK, { message: "Admin verified successfully", approved: true });
  });
}
