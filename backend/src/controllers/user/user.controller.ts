  import { Request, Response } from "express";
  import { HttpStatus } from "../../constants/http.status";
  import jwt from "jsonwebtoken";
  import { IUserController } from "./user.controller.interface";
  import { env } from "../../config/env";
  import { IUserService } from "../../services/interfaces/user.services.interface";
  import { ITokenService } from "../../services/interfaces/token.service.interface";
  import { sendError, sendSuccess } from "../../utils/application/response.util";
  import { RedisHelper } from "../../utils/database/redis.util";
  import logger from "../../utils/application/logger";

  export class UserController implements IUserController {
    constructor(
      private readonly _userSvc: IUserService,
      private readonly _tokenSvc: ITokenService
    ) {}

    async findUser(req: Request, res: Response): Promise<void> {
      try {
        const { type, value } = req.body;
        if (!type || !value) {
          sendError(res, HttpStatus.BAD_REQUEST, "Type and value are required");
          return;
        }
        const user = await this._userSvc.findByEmailOrUsername(value);
        const status = user ? true : false;
        sendSuccess(res, HttpStatus.OK, { user, status });
      } catch (error) {
        logger.error(`Error Finding User ${req.method} ${req.url}`, { error });
        sendError(res, HttpStatus.OK, error);
      }
    }

    async getUser(req: Request, res: Response): Promise<void> {
      try {
        const userId = (req as any).user?.userId;

        if (!userId) {
          sendError(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
          return;
        }

        const { username } = req.params as { username: string };
        if (!username) {
          sendError(res, HttpStatus.BAD_REQUEST, "Username is required");
          return;
        }
        const user = await this._userSvc.findUserByName(username, userId);
        if (!user) {
          sendError(res, HttpStatus.NOT_FOUND, "User Not Found");
          return;
        }
        sendSuccess(res, HttpStatus.OK, { user });
      } catch (error) {
        logger.error(`Error Getting User ${req.method} ${req.url}`, { error });
        sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Error Getting User");
      }
    }

    async cancelMembership(req: Request, res: Response): Promise<void> {
      try {
        const userId = (req as any).user?.userId;

        if (!userId) {
          sendError(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
          return;
        }

        const user = await this._userSvc.cancelMembership(userId);
        if (!user) {
          sendError(res, HttpStatus.NOT_FOUND, "User Not Found");
          return;
        }
        sendSuccess(res, HttpStatus.OK, { user });
      } catch (error) {
        logger.error(`Error Cancelling Membership ${req.method} ${req.url}`, { error });
        sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Error Cancelling Membership");
      }
    }

    async getCurrentUser(req: Request, res: Response): Promise<void> {
      try {
        const userId = (req as any).user?.userId;

        if (!userId) {
          sendError(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
          return;
        }

        const user = await this._userSvc.findUserById(userId);

        if (!user) {
          sendError(res, HttpStatus.NOT_FOUND, "User Not Found");
          return;
        }

        sendSuccess(res, HttpStatus.OK, { user, status: true });
      } catch (error) {
        logger.error(`Error Getting Current User ${req.method} ${req.url}`, { error });
        sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Error Getting Current User");
      }
    }

    async updateCurrentUser(req: Request, res: Response): Promise<void> {
      try {
        const token = req.cookies.accessToken;

        if (!token) {
          sendError(res, HttpStatus.UNAUTHORIZED, "No token found in cookies");
          return;
        }

        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET as string) as {
          userId: string;
        };

        let avatar = null;
        let banner = null;

        if (req.body.userData.avatar) {
          avatar = req.body.userData.avatar;
        }
        if (req.body.userData.banner) {
          banner = req.body.userData.banner;
        }

        const user = await this._userSvc.findUserByIdAndUpdate(decoded.userId, {
          ...req.body.userData,
          avatar,
          banner,
        });
        sendSuccess(res, HttpStatus.OK, { user }, "User updated successfully");
      } catch (error) {
        logger.error(`Error Updating Current User ${req.method} ${req.url}`, { error });
        sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Error Updating Current User");
      }
    }

    async getUsers(req: Request, res: Response): Promise<void> {
      try {
        const { search, page, limit } = req.query;
        if (!search || !page || !limit) {
          sendError(
            res,
            HttpStatus.BAD_REQUEST,
            "Missing required query parameters"
          );
          return;
        }
        const users = await this._userSvc.findUsers(
          search as string,
          Number(page),
          Number(limit)
        );
        sendSuccess(res, HttpStatus.OK, { users });
      } catch (error) {
        logger.error(`Error Fetching Users ${req.method} ${req.url}`, { error });
        sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching users");
      }
    }

    async toggleBan(req: Request, res: Response): Promise<void> {
      try {
        const userId = req.params.userId;
        if (!userId) {
          sendError(res, HttpStatus.BAD_REQUEST, "User ID is required");
          return;
        }
        const result = await this._userSvc.toggleBanStatus(userId);

        if (result.isBanned) {
          const tokenData = await this._tokenSvc.getTokenByUserId(userId);
          const token = tokenData?.accessToken;

          if (token) {
            const decoded = jwt.decode(token) as jwt.JwtPayload;

            if (decoded && decoded.exp) {
              const expiry = decoded.exp - Math.floor(Date.now() / 1000);
              RedisHelper.set(`blacklist_${token}`, "true", expiry);
            }
          }
        }
        sendSuccess(res, HttpStatus.OK, { result }, "User ban status toggled");
      } catch (error) {
        logger.error(`Error Toggling User Ban Status ${req.method} ${req.url}`, { error });
        sendError(
          res,
          HttpStatus.INTERNAL_SERVER_ERROR,
          "Error toggling user ban status"
        );
      }
    }

    async giftItem(req: Request, res: Response): Promise<void> {
      try {
        const { userId, type } = req.params;
        const { itemId } = req.body;

        if (!itemId || !userId || !type) {
          sendError(
            res,
            HttpStatus.BAD_REQUEST,
            "Item ID, User ID and Type are required"
          );
          return;
        }

        const result = await this._userSvc.giftItem(userId, itemId, type);

        if (!result) {
          sendError(res, HttpStatus.BAD_REQUEST, "Error gifting item");
        }
        sendSuccess(
          res,
          HttpStatus.OK,
          { result },
          `Gifted ${type} successfully`
        );
      } catch (error) {
        logger.error(`Error Gifting Item ${req.method} ${req.url}`, { error });
        sendError(res, HttpStatus.BAD_REQUEST, "Error gifting item");
      }
    }
    async resendOtp(req: Request, res: Response): Promise<void> {
      try {
        const { email } = req.body;
        if (!email) {
          sendError(res, HttpStatus.BAD_REQUEST, "Email is required");
          return;
        }
        const result = await this._userSvc.resendOtp(email);
        sendSuccess(res, HttpStatus.OK, result, "OTP resent successfully");
      } catch (error: any) {
        logger.error(`Error Resending OTP ${req.method} ${req.url}`, { error });
        sendError(res, HttpStatus.BAD_REQUEST, "Error resending OTP");
      }
    }

    async claimDailyReward(req: Request, res: Response): Promise<void> {
      try {
        const userId = (req as any).user?.userId;

        if (!userId) {
          sendError(res, HttpStatus.BAD_REQUEST, "User ID is required");
          return;
        }

        const updatedUser = await this._userSvc.claimDailyReward(userId);

        if (!updatedUser) {
          sendError(res, HttpStatus.BAD_REQUEST, "Error claiming daily reward");
          return;
        }

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
      } catch (error) {
        sendError(res, HttpStatus.BAD_REQUEST, "Error claiming daily reward");
      }
    }

    async verifyAdmin(req: Request, res: Response): Promise<void> {
      try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
          sendError(res, HttpStatus.BAD_REQUEST, "Token missing");
          return;
        }

        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET!) as {
          role: string;
        };

        if (!decoded || decoded.role !== "admin") {
          sendError(res, HttpStatus.FORBIDDEN, "Only admins allowed");
          return;
        }

        sendSuccess(res, HttpStatus.OK, { message: "Admin verified successfully", approved: true });
      } catch (error) {
        logger.error(`Error Verifying Admin ${req.method} ${req.url}`, { error });
        sendError(res, HttpStatus.BAD_REQUEST, "Error verifying admin");
      }
    }
  }
