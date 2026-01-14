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
exports.GroupRepository = void 0;
const chat_1 = require("../../chat");
const _core_1 = require("../../../shared/core");
class GroupRepository extends _core_1.BaseRepository {
    constructor() {
        super(chat_1.GroupModel);
    }
    createGroup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.create(data);
        });
    }
    findByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.find({
                $or: [{ createdBy: userId }, { admins: userId }],
            });
        });
    }
    findGroupById(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .findById(groupId)
                .populate({
                path: "members",
                populate: [{ path: "avatar" }, { path: "banner" }],
            })
                .populate({
                path: "admins",
                populate: [{ path: "avatar" }, { path: "banner" }],
            })
                .populate({
                path: "createdBy",
                populate: [{ path: "avatar" }, { path: "banner" }],
            })
                .populate({
                path: "userRequests",
                populate: [{ path: "avatar" }, { path: "banner" }],
            })
                .populate({
                path: "voiceRoom.host",
                populate: [{ path: "avatar" }, { path: "banner" }],
            })
                .populate({
                path: "voiceRoom.participants",
                populate: [{ path: "avatar" }, { path: "banner" }],
            })
                .populate({
                path: "voiceRoom.mutedUsers",
                populate: [{ path: "avatar" }, { path: "banner" }],
            });
        });
    }
    getAllGroups(query, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.find(query)
                .skip(skip)
                .limit(limit)
                .populate({
                path: "members",
                populate: [{ path: "avatar" }, { path: "banner" }],
            })
                .populate({
                path: "admins",
                populate: [{ path: "avatar" }, { path: "banner" }],
            })
                .populate({
                path: "createdBy",
                populate: [{ path: "avatar" }, { path: "banner" }],
            });
        });
    }
    countAllGroups(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.countDocuments(filter);
        });
    }
    updateGroup(groupId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(groupId, data, { new: true });
        });
    }
    deleteGroup(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(groupId, { isDeleted: true }, { new: true });
        });
    }
    addMembers(groupId, memberIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(groupId, { $addToSet: { members: { $each: memberIds } } }, { new: true });
        });
    }
    removeMember(groupId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(groupId, {
                $pull: {
                    members: userId,
                    admins: userId,
                },
            }, { new: true });
        });
    }
    addAdmin(groupId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(groupId, { $push: { admins: userId } }, { new: true });
        });
    }
    removeAdmin(groupId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(groupId, {
                $pull: { admins: userId },
            });
        });
    }
    updateGroupDetails(groupId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(groupId, updatedData, {
                new: true,
            });
        });
    }
    getMembers(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.model.findById(groupId);
            return group ? group.members : null;
        });
    }
    saveGroup(group) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(group._id, group, { new: true });
        });
    }
    sendJoinRequest(groupId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(groupId, { $push: { userRequests: userId } }, { new: true });
        });
    }
    acceptJoinRequest(groupId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(groupId, {
                $pull: { userRequests: userId },
                $push: { members: userId },
            }, { new: true });
        });
    }
    leaveGroup(groupId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(groupId, { $pull: { members: userId } }, { new: true });
        });
    }
}
exports.GroupRepository = GroupRepository;
