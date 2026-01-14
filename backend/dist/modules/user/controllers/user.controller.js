"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const user_1 = require("../../user");
const dtos_1 = require("../../user/dtos");
class UserController {
    constructor(querySvc, commandSvc, engagementSvc, tokenSvc) {
        this.querySvc = querySvc;
        this.commandSvc = commandSvc;
        this.engagementSvc = engagementSvc;
        this.tokenSvc = tokenSvc;
        this.findUser = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.FindUserRequestDto.from(req.body);
            const val = dto.validate();
            if (!val.valid)
                throw new application_1.AppError(400, (_a = val.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const available = yield this.querySvc.findByEmailOrUsername(dto.value);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { available });
        }));
        this.getUser = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!currentUserId)
                throw new application_1.AppError(401, "not authorized");
            const dto = dtos_1.GetUserDto.from(req.params);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_b = validation.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            }
            const user = yield this.querySvc.findUserByName(dto.username, currentUserId);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { user });
        }));
        this.getCurrentUser = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId)
                throw new application_1.AppError(401, "not authorized");
            const user = yield this.querySvc.findUserById(userId);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { user, status: true });
        }));
        this.updateCurrentUser = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId)
                throw new application_1.AppError(401, "not authorized");
            const dto = user_1.UpdateUserRequestDto.from(req.body.userData);
            const val = dto.validate();
            if (!val.valid)
                throw new application_1.AppError(400, (_b = val.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            const user = yield this.commandSvc.updateUser(userId, dto);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { user }, "User updated successfully");
        }));
        this.getUsers = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.GetUsersRequestDto.from(req.query);
            const val = dto.validate();
            if (!val.valid)
                throw new application_1.AppError(400, (_a = val.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const result = yield this.querySvc.findUsers(dto.search, dto.page, dto.limit);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result);
        }));
        this.toggleBan = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.ToggleBanRequestDto.from(req.params);
            const val = dto.validate();
            if (!val.valid)
                throw new application_1.AppError(400, (_a = val.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const result = yield this.commandSvc.toggleBanStatus(dto.userId);
            if (result.isBanned) {
                yield this.tokenSvc.revokeActiveAccessTokens(dto.userId);
            }
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { result }, "User ban status toggled");
        }));
        this.giftItem = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { userId, type } = req.params;
            if (!userId || !type)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "userId and type are required");
            const dto = dtos_1.GiftItemRequestDto.from(req.body);
            const val = dto.validate();
            if (!val.valid)
                throw new application_1.AppError(400, (_a = val.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const result = yield this.engagementSvc.giftItem(userId, dto.itemId, type);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { result }, `Gifted ${type} successfully`);
        }));
        this.cancelMembership = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId)
                throw new application_1.AppError(401, "not authorized");
            const ok = yield this.engagementSvc.cancelMembership(userId);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { success: ok });
        }));
        this.claimDailyReward = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId)
                throw new application_1.AppError(401, "not authorized");
            const updatedUser = yield this.engagementSvc.claimDailyReward(userId);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, {
                message: "Daily reward claimed!",
                dailyRewardDay: updatedUser.dailyRewardDay,
                lastRewardClaimDate: updatedUser.lastRewardClaimDate,
            }, "Daily reward claimed successfully");
        }));
        this.verifyAdmin = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, {
                message: "Admin verified",
                approved: true,
            });
        }));
        this.toggleUserNotification = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            }
            const result = yield this.commandSvc.toggleUserNotification(userId);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, {
                message: "Notification toggled successfully",
                result,
            });
        }));
        this.purchaseMarketItem = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId)
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            const dto = dtos_1.PurchaseMarketItemRequestDto.from({ itemId: req.params.id });
            const val = dto.validate();
            if (!val.valid)
                throw new application_1.AppError(400, (_b = val.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            const result = yield this.engagementSvc.purchaseMarketItem(dto.itemId, userId);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result, "Item purchased successfully");
        }));
    }
}
exports.UserController = UserController;
