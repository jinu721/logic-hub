import { Request, Response } from "express";
import { asyncHandler, sendSuccess, AppError } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  IUserQueryService,
  IUserCommandService,
  IUserEngagementService,
  IUserController,
  UpdateUserRequestDto,
} from "@modules/user";
import { ITokenService } from "@modules/token";
import { FindUserRequestDto, GetUsersRequestDto, PurchaseMarketItemRequestDto, ToggleBanRequestDto, GiftItemRequestDto, GetUserDto } from "@modules/user/dtos";

export class UserController implements IUserController {
  constructor(
    private readonly querySvc: IUserQueryService,
    private readonly commandSvc: IUserCommandService,
    private readonly engagementSvc: IUserEngagementService,
    private readonly tokenSvc: ITokenService
  ) { }

  findUser = asyncHandler(async (req: Request, res: Response) => {
    const dto = FindUserRequestDto.from(req.body);
    const val = dto.validate();
    if (!val.valid) throw new AppError(400, val.errors?.join(", "));
    const available = await this.querySvc.findByEmailOrUsername(dto.value);
    return sendSuccess(res, HttpStatus.OK, { available });
  });

  getUser = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.user?.userId;
    if (!currentUserId) throw new AppError(401, "not authorized");

    const dto = GetUserDto.from(req.params);
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const user = await this.querySvc.findUserByName(dto.username, currentUserId);
    return sendSuccess(res, HttpStatus.OK, { user });
  });

  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(401, "not authorized");
    const user = await this.querySvc.findUserById(userId);
    return sendSuccess(res, HttpStatus.OK, { user, status: true });
  });

  updateCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(401, "not authorized");
    const dto = UpdateUserRequestDto.from(req.body.userData);
    const val = dto.validate();
    if (!val.valid) throw new AppError(400, val.errors?.join(", "));
    const user = await this.commandSvc.updateUser(userId, dto)

    return sendSuccess(
      res,
      HttpStatus.OK,
      { user },
      "User updated successfully"
    );
  });

  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const dto = GetUsersRequestDto.from(req.query);
    const val = dto.validate();
    if (!val.valid) throw new AppError(400, val.errors?.join(", "));
    const result = await this.querySvc.findUsers(dto.search, dto.page, dto.limit);
    return sendSuccess(res, HttpStatus.OK, result);
  });

  toggleBan = asyncHandler(async (req: Request, res: Response) => {
    const dto = ToggleBanRequestDto.from(req.params as any);
    const val = dto.validate();
    if (!val.valid) throw new AppError(400, val.errors?.join(", "));
    const result = await this.commandSvc.toggleBanStatus(dto.userId);

    if (result.isBanned) {
      await this.tokenSvc.revokeActiveAccessTokens(dto.userId);
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

    if (!userId || !type) throw new AppError(HttpStatus.BAD_REQUEST, "userId and type are required");

    const dto = GiftItemRequestDto.from(req.body);
    const val = dto.validate();
    if (!val.valid) throw new AppError(400, val.errors?.join(", "));
    const result = await this.engagementSvc.giftItem(userId, dto.itemId, type)

    return sendSuccess(
      res,
      HttpStatus.OK,
      { result },
      `Gifted ${type} successfully`
    );
  });

  cancelMembership = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(401, "not authorized");
    const ok = await this.engagementSvc.cancelMembership(userId);
    return sendSuccess(res, HttpStatus.OK, { success: ok });
  });

  claimDailyReward = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
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
    return sendSuccess(res, HttpStatus.OK, {
      message: "Admin verified",
      approved: true,
    });
  });
  toggleUserNotification = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.userId;
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

  purchaseMarketItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    const dto = PurchaseMarketItemRequestDto.from({ itemId: req.params.id });
    const val = dto.validate();
    if (!val.valid) throw new AppError(400, val.errors?.join(", "));
    const result = await this.engagementSvc.purchaseMarketItem(dto.itemId, userId);
    sendSuccess(res, HttpStatus.OK, result, "Item purchased successfully");
  });
}
