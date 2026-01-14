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
exports.UserQueryService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const user_1 = require("../../user");
class UserQueryService extends _core_1.BaseService {
    constructor(_userRepo, _submissionRepo) {
        super();
        this._userRepo = _userRepo;
        this._submissionRepo = _submissionRepo;
    }
    toDTO(user) {
        return (0, user_1.toPublicUserDTO)(user);
    }
    toDTOs(users) {
        return (0, user_1.toPublicUserDTOs)(users);
    }
    buildUserData(user, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rank = yield this._userRepo.findUserRank(user._id.toString());
            const completedDomains = yield this._submissionRepo.findCompletedDomainsByUser((0, application_1.toObjectId)(user._id.toString()));
            return Object.assign(Object.assign({}, this.mapOne(user)), { userRank: rank, completedDomains: completedDomains, currentUser: user._id.toString() === currentUserId });
        });
    }
    findByEmailOrUsername(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this._userRepo.getByEmailOrUsername(value);
            return !exists;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepo.getUserByEmail(email);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            return this.buildUserData(user, email);
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepo.getUserById(id);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            return this.buildUserData(user, id);
        });
    }
    findUserByName(username, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepo.getByEmailOrUsername(username);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            return this.buildUserData(user, currentUserId);
        });
    }
    findUsers(search, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [users, totalItems] = yield Promise.all([
                this._userRepo.findAllUsers(search, skip, limit),
                this._userRepo.countAllUsers(search),
            ]);
            if (!users || users.length === 0)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Users not found");
            return { users: this.mapMany(users), totalItems };
        });
    }
    searchUsers(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this._userRepo.searchUsers(search);
            if (!users || users.length === 0)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Users not found");
            return this.mapMany(users);
        });
    }
}
exports.UserQueryService = UserQueryService;
