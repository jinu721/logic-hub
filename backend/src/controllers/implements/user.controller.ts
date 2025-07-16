import { Request, Response } from "express";
import { UserService } from "../../services/implements/user.service";
import { HttpStatus } from "../../constants/http.status";
import jwt from "jsonwebtoken";
import { IUserController } from "../interfaces/user.controller.interface";
import redisClient from "../../config/redis.config";
import { TokenService } from "../../services/implements/token.service";

export class UserController implements IUserController {
  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  async findUser(req: Request, res: Response): Promise<void> {
    try {
      const { type, value } = req.body;
      const user = await this.userService.findByEmailOrUsername(value);
      const status = user ? true : false;
      res.status(HttpStatus.OK).json({ type, status });
    } catch (err) {
      console.log(`Error Getting User: ${err}`);
      res.status(HttpStatus.OK).json({
        message:
          err instanceof Error ? err.message : "An Uxpected Error Occured",
      });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const { username } = req.params as { username: string };
      const user = await this.userService.findUserByName(username, userId);
      res.status(HttpStatus.OK).json({ user });
    } catch (err) {
      console.log(`Error Getting User: ${err}`);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error Getting User" });
    }
  }

  async cancelMembership(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const user = await this.userService.cancelMembership(userId);
      res.status(HttpStatus.OK).json({ user });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error Getting User" });
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const user = await this.userService.findUserById(userId);

      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({ message: "User Not Found" });
        return;
      }

      res.status(HttpStatus.OK).json({ user, status: true });
    } catch (err) {
      console.log("Error Getting User:", err);
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Invalid or expired token" });
    }
  }
  async updateCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "No token found in cookies" });
        return;
      }

      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as { userId: string };

      let avatar = null;
      let banner = null;

      if (req.body.userData.avatar) {
        avatar = req.body.userData.avatar;
      }
      if (req.body.userData.banner) {
        banner = req.body.userData.banner;
      }

      console.log(avatar, banner);

      const user = await this.userService.findUserByIdAndUpdate(
        decoded.userId,
        { ...req.body.userData, avatar, banner }
      );
      res.status(HttpStatus.OK).json({ user });
    } catch (err) {
      console.error("Token Error:", err);
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Invalid or expired token" });
    }
  }
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const {search,page,limit} = req.query;
      const users = await this.userService.findUsers(search as string,Number(page),Number(limit));
      res.status(HttpStatus.OK).json({ users });
    } catch (err) {
      console.log(`Get Users Error : ${err}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          err instanceof Error ? err.message : "An Unexpected Error Occured",
      });
    }
  }

  async toggleBan(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const result = await this.userService.toggleBanStatus(userId);

      if (result.isBanned) {
        const tokenData = await this.tokenService.getTokenByUserId(userId);
        const token = tokenData?.accessToken;

        if (token) {
          const decoded = jwt.decode(token) as jwt.JwtPayload;

          if (decoded && decoded.exp) {
            const expiry = decoded.exp - Math.floor(Date.now() / 1000);
            redisClient.setEx(`blacklist_${token}`, expiry, "true");
          }
        }
      }
      res.status(HttpStatus.OK).json({
        message: result.isBanned
          ? "User has been banned."
          : "User has been unbanned.",
        status: true,
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  }

  async giftItem(req: Request, res: Response): Promise<void> {
    try {
      const { userId, type } = req.params;
      const { itemId } = req.body;

      const result = await this.userService.giftItem(userId, itemId, type);
      res.status(200).json({ message: `Gifted ${type} successfully`, result });
    } catch (err: any) {
      console.log(`Gift Item Error : ${err}`);
      res.status(400).json({ error: err.message });
    }
  }
  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      console.log(req.body);
      const result = await this.userService.resendOtp(email);
      res.status(200).json({ message: `OTP Sended Successfully`, result });
    } catch (err: any) {
      console.log(err);
      res.status(400).json({ error: err.message });
    }
  }

  async claimDailyReward(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const updatedUser = await this.userService.claimDailyReward(userId);

      res.status(200).json({
        message: "Daily reward claimed!",
        dailyRewardDay: updatedUser.dailyRewardDay,
        lastRewardClaimDate: updatedUser.lastRewardClaimDate,
      });
    } catch (error: any) {
      console.log(error);
      res
        .status(500)
        .json({ message: error.message || "Error claiming reward" });
    }
  }
}
