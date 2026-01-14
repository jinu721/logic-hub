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
exports.ConversationRepository = void 0;
const mongoose_1 = require("mongoose");
const chat_1 = require("../../chat");
const _core_1 = require("../../../shared/core");
class ConversationRepository extends _core_1.BaseRepository {
    constructor() {
        super(chat_1.ConversationModel);
    }
    findOneToOne(userA, userB) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({
                type: "one-to-one",
                participants: { $all: [userA, userB] },
            }).populate([
                {
                    path: "participants",
                    select: "username bio avatar banner isOnline lastSeen",
                    populate: [
                        {
                            path: "avatar",
                            select: "url",
                        },
                        {
                            path: "banner",
                            select: "url",
                        },
                    ],
                },
                {
                    path: "typingUsers",
                    select: "username avatar",
                    populate: {
                        path: "avatar",
                        select: "url",
                    },
                },
                {
                    path: "latestMessage",
                    populate: [
                        {
                            path: "sender",
                            select: "username avatar",
                            populate: {
                                path: "avatar",
                                select: "url",
                            },
                        },
                        {
                            path: "replyTo",
                            populate: {
                                path: "sender",
                                select: "username avatar",
                                populate: {
                                    path: "avatar",
                                    select: "url",
                                },
                            },
                        },
                        {
                            path: "media",
                            select: "url type",
                        },
                    ],
                },
            ]);
        });
    }
    findConversationById(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findById(conversationId).populate([
                {
                    path: "participants",
                    select: "username bio avatar banner isOnline lastSeen",
                    populate: [
                        {
                            path: "avatar",
                            select: "url",
                        },
                        {
                            path: "banner",
                            select: "url",
                        },
                    ],
                },
                {
                    path: "typingUsers",
                    select: "username avatar",
                    populate: {
                        path: "avatar",
                        select: "url",
                    },
                },
                {
                    path: "latestMessage",
                    populate: [
                        {
                            path: "sender",
                            select: "username avatar",
                            populate: {
                                path: "avatar",
                                select: "url",
                            },
                        },
                        {
                            path: "replyTo",
                            populate: {
                                path: "sender",
                                select: "username avatar",
                                populate: {
                                    path: "avatar",
                                    select: "url",
                                },
                            },
                        },
                        {
                            path: "media",
                            select: "url type",
                        },
                    ],
                },
            ]);
        });
    }
    findConversationsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose_1.Types.ObjectId(userId);
            const conversation = yield this.model
                .find({ participants: objectId })
                .populate([
                {
                    path: "participants",
                    select: "username bio avatar banner isOnline lastSeen",
                    populate: [
                        {
                            path: "avatar",
                            select: "url",
                        },
                        {
                            path: "banner",
                            select: "url",
                        },
                    ],
                },
                {
                    path: "typingUsers",
                    select: "username avatar",
                    populate: {
                        path: "avatar",
                        select: "url",
                    },
                },
                {
                    path: "latestMessage",
                    populate: [
                        {
                            path: "sender",
                            select: "username avatar",
                            populate: {
                                path: "avatar",
                                select: "url",
                            },
                        },
                        {
                            path: "replyTo",
                            populate: {
                                path: "sender",
                                select: "username avatar",
                                populate: {
                                    path: "avatar",
                                    select: "url",
                                },
                            },
                        },
                        {
                            path: "media",
                            select: "url type",
                        },
                    ],
                },
            ]);
            return conversation;
        });
    }
    addParticipants(groupId, userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .findOneAndUpdate({ groupId }, { $addToSet: { participants: { $each: userIds } } }, { new: true });
        });
    }
    removeParticipants(groupId, userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .findOneAndUpdate({ groupId }, { $pull: { participants: { $in: userIds } } }, { new: true });
        });
    }
    addUnreadCountsForUsers(conversationId, userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const incObject = {};
            userIds.forEach((userId) => {
                incObject[`unreadCounts.${userId}`] = 1;
            });
            return yield this.model.findByIdAndUpdate(conversationId, { $inc: incObject }, { new: true });
        });
    }
    markRead(conversationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .findByIdAndUpdate(conversationId, { $unset: { [`unreadCounts.${userId}`]: "" } }, { new: true });
        });
    }
    createOneToOne(userA, userB) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create({
                type: "one-to-one",
                participants: [userA, userB],
            });
        });
    }
    createGroup(participants, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create({
                type: "group",
                participants: participants,
                groupId: groupId,
            });
        });
    }
    setTypingUser(conversationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .findByIdAndUpdate(conversationId, { $addToSet: { typingUsers: userId } }, { new: true }).populate("typingUsers");
        });
    }
    removeTypingUser(conversationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .findByIdAndUpdate(conversationId, { $pull: { typingUsers: userId } }, { new: true }).populate("typingUsers");
        });
    }
    getTypingUsers(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield this.model
                .findById(conversationId)
                .select("typingUsers");
            return (conversation === null || conversation === void 0 ? void 0 : conversation.typingUsers) || [];
        });
    }
    softDeleteByGroupId(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOneAndUpdate({ groupId }, { isDeleted: true }, { new: true });
        });
    }
    saveConversation(conversation) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(conversation._id, conversation, {
                new: true,
            });
        });
    }
    findConversationByGroup(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .findOne({ groupId })
                .populate([
                {
                    path: "participants",
                    select: "username bio avatar banner",
                    populate: [
                        {
                            path: "avatar",
                            select: "url",
                        },
                        {
                            path: "banner",
                            select: "url",
                        },
                    ],
                },
                {
                    path: "latestMessage",
                    populate: {
                        path: "sender",
                        select: "username avatar",
                        populate: {
                            path: "avatar",
                            select: "url",
                        },
                    },
                },
            ])
                .populate("latestMessage")
                .populate("typingUsers");
        });
    }
    updateLastMessage(conversationId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .findByIdAndUpdate(conversationId, { latestMessage: messageId }, { new: true });
        });
    }
}
exports.ConversationRepository = ConversationRepository;
