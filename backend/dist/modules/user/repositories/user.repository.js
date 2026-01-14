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
exports.UserRepository = void 0;
const _core_1 = require("../../../shared/core");
const user_1 = require("../../user");
const database_1 = require("../../../shared/utils/database");
class UserRepository extends _core_1.BaseRepository {
    constructor() {
        super(user_1.UserModel);
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create(data);
        });
    }
    getByEmailOrUsername(value) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.populateAndLean)(this.model.findOne({ $or: [{ email: value }, { username: value }] }), database_1.populateUser);
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.populateAndLean)(this.model.findOne({ email }), database_1.populateUser);
        });
    }
    getAllByRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.toLeanMany)(this.model.find({ role }));
        });
    }
    getUserByName(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.populateAndLean)(this.model.findOne({ username }), database_1.populateUser);
        });
    }
    verifyAccount(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.toLean)(this.model.findOneAndUpdate({ email }, { isVerified: true }, { new: true }));
        });
    }
    findUserRank(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, database_1.toLean)(this.model.findById(userId));
            if (!user)
                return 0;
            const userXp = user.stats.totalXpPoints;
            const usersWithMoreXp = yield this.model.countDocuments({
                "stats.totalXpPoints": { $gt: userXp },
            });
            return usersWithMoreXp + 1;
        });
    }
    updateUser(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.toLean)(this.model.findByIdAndUpdate(userId, updateData, { new: true }));
        });
    }
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(user._id, user, { new: true });
        });
    }
    findAllUsers(search, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.populateAndLeanMany)(this.model
                .find({ username: { $regex: search || "", $options: "i" } })
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit), database_1.populateUser);
        });
    }
    countAllUsers(search) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.countDocuments({
                username: { $regex: search || "", $options: "i" },
            });
        });
    }
    searchUsers(search) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.populateAndLeanMany)(this.model
                .find({
                $or: [
                    { username: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
            })
                .sort({ _id: -1 }), database_1.populateUser);
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.populateAndLean)(this.model.findById(userId), database_1.populateUser);
        });
    }
    findUsersByIds(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.populateAndLeanMany)(this.model.find({ _id: { $in: userIds } }), database_1.populateUser);
        });
    }
    cancelMembership(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.toLean)(this.model.findByIdAndUpdate(userId, { "membership.isActive": false }, { new: true }));
        });
    }
    updateUserLevel(userId, level) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.toLean)(this.model.findByIdAndUpdate(userId, { "stats.level": level }, { new: true }));
        });
    }
    updateUserXP(userId, xp) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.toLean)(this.model.findByIdAndUpdate(userId, { "stats.totalXpPoints": xp }, { new: true }));
        });
    }
}
exports.UserRepository = UserRepository;
