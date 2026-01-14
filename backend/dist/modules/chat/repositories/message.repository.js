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
exports.MessageRepository = void 0;
const mongoose_1 = require("mongoose");
const chat_1 = require("../../chat");
const _core_1 = require("../../../shared/core");
class MessageRepository extends _core_1.BaseRepository {
    constructor() {
        super(chat_1.MessageModel);
    }
    createMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create(data);
        });
    }
    editMessage(messageId, newText) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .findByIdAndUpdate(messageId, { content: newText, isEdited: true }, { new: true });
        });
    }
    getMessages(limit, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .find(query)
                .sort({ createdAt: 1 })
                .limit(limit)
                .lean()
                .populate([
                {
                    path: "sender",
                    select: "username avatar banner membership stats",
                    populate: [{ path: "avatar" }, { path: "banner" }],
                },
                {
                    path: "replyTo",
                    populate: {
                        path: "sender",
                        select: "username avatar banner",
                        populate: [{ path: "avatar" }, { path: "banner" }],
                    },
                },
                {
                    path: "reactions.userId",
                    select: "username avatar banner",
                    populate: [{ path: "avatar" }, { path: "banner" }],
                },
                {
                    path: "seenBy",
                    select: "username avatar banner isOnline",
                    populate: [{ path: "avatar" }, { path: "banner" }],
                },
            ]);
        });
    }
    deleteMessage(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(messageId, { isDeleted: true }, { new: true });
        });
    }
    addReaction(messageId, userId, emoji) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.model.findOne({
                _id: messageId,
                "reactions.userId": userId,
            });
            const query = message
                ? this.model.findOneAndUpdate({ _id: messageId, "reactions.userId": userId }, { $set: { "reactions.$.emoji": emoji } }, { new: true })
                : this.model.findByIdAndUpdate(messageId, { $push: { reactions: { userId, emoji } } }, { new: true });
            return yield query;
        });
    }
    removeReaction(messageId, userId, reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .findByIdAndUpdate(messageId, { $pull: { reactions: { userId, emoji: reaction } } }, { new: true });
        });
    }
    markAsSeen(messageId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(messageId, {
                $push: { seenBy: { userId } },
            });
        });
    }
    getMessageById(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findById(messageId).populate([
                {
                    path: "sender",
                    select: "username avatar banner",
                    populate: [{ path: "avatar" }, { path: "banner" }],
                },
                {
                    path: "replyTo",
                    populate: {
                        path: "sender",
                        select: "username avatar banner",
                        populate: [{ path: "avatar" }, { path: "banner" }],
                    },
                },
            ]);
        });
    }
    findMessageById(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findById(messageId).populate([
                {
                    path: "sender",
                    select: "username avatar banner",
                    populate: [{ path: "avatar" }, { path: "banner" }],
                },
                {
                    path: "replyTo",
                    populate: {
                        path: "sender",
                        select: "username avatar banner",
                        populate: [{ path: "avatar" }, { path: "banner" }],
                    },
                },
            ]);
        });
    }
    save(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return message.save();
        });
    }
    closePoll(pollId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(pollId, { isOpen: false }, { new: true });
        });
    }
    markMessagesAsSeen(conversationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateMany({
                conversationId: new mongoose_1.Types.ObjectId(conversationId),
                sender: { $ne: new mongoose_1.Types.ObjectId(userId) },
                seenBy: { $ne: new mongoose_1.Types.ObjectId(userId) },
            }, {
                $addToSet: { seenBy: new mongoose_1.Types.ObjectId(userId) },
            });
        });
    }
}
exports.MessageRepository = MessageRepository;
