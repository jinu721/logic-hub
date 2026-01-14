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
exports.UserCommandService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const user_1 = require("../../user");
class UserCommandService extends _core_1.BaseService {
    constructor(userRepo, hashProv) {
        super();
        this.userRepo = userRepo;
        this.hashProv = hashProv;
    }
    toDTO(user) {
        return (0, user_1.toPublicUserDTO)(user);
    }
    toDTOs(users) {
        return (0, user_1.toPublicUserDTOs)(users);
    }
    getPopulated(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.getUserById(userId);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            return user;
        });
    }
    findUserByIdAndUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.userRepo.updateUser((0, application_1.toObjectId)(id), data);
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            return this.mapOne(yield this.getPopulated(id));
        });
    }
    updateUser(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = Object.assign(Object.assign({}, data), { avatar: data.avatar ? (0, application_1.toObjectId)(data.avatar) : undefined, banner: data.banner ? (0, application_1.toObjectId)(data.banner) : undefined });
            const updated = yield this.userRepo.updateUser((0, application_1.toObjectId)(userId), updateData);
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            return this.mapOne(yield this.getPopulated(userId));
        });
    }
    changePassword(userId, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.getUserById(userId);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            const valid = yield this.hashProv.comparePasswords(oldPassword, user.password);
            if (!valid)
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Invalid old password");
            const hashed = yield this.hashProv.hashPassword(newPassword);
            const updated = yield this.userRepo.updateUser((0, application_1.toObjectId)(userId), {
                password: hashed,
            });
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.INTERNAL_SERVER_ERROR, "Unable to update password");
            return this.mapOne(yield this.getPopulated(userId));
        });
    }
    toggleUserNotification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.getUserById(userId);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            const updated = yield this.userRepo.updateUser((0, application_1.toObjectId)(userId), {
                notifications: !user.notifications,
            });
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            return this.mapOne(yield this.getPopulated(userId));
        });
    }
    toggleBanStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.getUserById(userId);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            const newStatus = !user.isBanned;
            yield this.userRepo.updateUser((0, application_1.toObjectId)(userId), { isBanned: newStatus });
            return { isBanned: newStatus };
        });
    }
}
exports.UserCommandService = UserCommandService;
