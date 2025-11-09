import { Request, Response } from "express";
import { asyncHandler, sendSuccess, AppError } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  IUserQueryService,
  IUserCommandService,
  IUserEngagementService,
  IUserController,
  UpdateUserDTO,
} from "@modules/user";
import { ITokenService } from "@modules/token";

export class UserController implements IUserController {
  constructor(
    private readonly querySvc: IUserQueryService,
    private readonly commandSvc: IUserCommandService,
    private readonly engagementSvc: IUserEngagementService,
    private readonly tokenSvc: ITokenService
  ) {}

  findUser = asyncHandler(async (req: Request, res: Response) => {
    const { value } = req.body as { value?: string };
    if (!value) throw new AppError(HttpStatus.BAD_REQUEST, "value is required");

    const available = await this.querySvc.findByEmailOrUsername(value);
    return sendSuccess(res, HttpStatus.OK, { available });
  });

  getUser = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = (req as any).user?.userId;
    if (!currentUserId) throw new AppError(401, "not authorized");

    const { username } = req.params as { username?: string };
    if (!username)
      throw new AppError(HttpStatus.BAD_REQUEST, "username is required");

    const user = await this.querySvc.findUserByName(username, currentUserId);
    return sendSuccess(res, HttpStatus.OK, { user });
  });

  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new AppError(401, "not authorized");
    const user = await this.querySvc.findUserById(userId);
    return sendSuccess(res, HttpStatus.OK, { user, status: true });
  });

  updateCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new AppError(401, "not authorized");
    const { userData } = req.body as { userData?: Record<string, any> };

    if (!userData) {
      throw new AppError(HttpStatus.BAD_REQUEST, "userData is required");
    }

    const dto: UpdateUserDTO = {
      username: userData?.username,
      bio: userData?.bio,
      avatar: userData?.avatar,
      banner: userData?.banner,
    };

    if (!userData)
      throw new AppError(HttpStatus.BAD_REQUEST, "userData is required");

    const user = await this.commandSvc.updateUser(userId, dto);
    return sendSuccess(
      res,
      HttpStatus.OK,
      { user },
      "User updated successfully"
    );
  });

  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const { search = "", page = "1", limit = "20" } = req.query as any;
    const result = await this.querySvc.findUsers(
      search,
      Number(page),
      Number(limit)
    );
    return sendSuccess(res, HttpStatus.OK, result);
  });

  toggleBan = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params as { userId?: string };
    if (!userId) throw new AppError(HttpStatus.BAD_REQUEST, "userId required");

    const result = await this.commandSvc.toggleBanStatus(userId);

    if (result.isBanned) {
      await this.tokenSvc.revokeActiveAccessTokens(userId);
    }

    return sendSuccess(
      res,
      HttpStatus.OK,
      { result },
      "User ban status toggled"
    );
  });

  giftItem = asyncHandler(async (req: Request, res: Response) => {
    const { userId, type } = req.params as { userId?: string; type?: string };
    const { itemId } = req.body as { itemId?: string };

    if (!userId || !type || !itemId)
      throw new AppError(HttpStatus.BAD_REQUEST, "Invalid inputs");

    const result = await this.engagementSvc.giftItem(userId, itemId, type);
    return sendSuccess(
      res,
      HttpStatus.OK,
      { result },
      `Gifted ${type} successfully`
    );
  });

  cancelMembership = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new AppError(401, "not authorized");
    const ok = await this.engagementSvc.cancelMembership(userId);
    return sendSuccess(res, HttpStatus.OK, { success: ok });
  });

  claimDailyReward = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new AppError(401, "not authorized");
    const updatedUser = await this.engagementSvc.claimDailyReward(userId);

    return sendSuccess(
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
    // admin role validated in middleware before controller
    return sendSuccess(res, HttpStatus.OK, {
      message: "Admin verified",
      approved: true,
    });
  });
  toggleUserNotification = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const userId = (req as any).user?.userId;
      if (!userId) {
        throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
      }

      const result = await this.commandSvc.toggleUserNotification(userId);
      sendSuccess(res, HttpStatus.OK, {
        message: "Notification toggled successfully",
        result,
      });
    }
  );
}
