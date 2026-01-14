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
exports.MessageEngagementService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const dtos_1 = require("../../chat/dtos");
const mongoose_1 = require("mongoose");
class MessageEngagementService extends _core_1.BaseService {
    constructor(messageRepo) {
        super();
        this.messageRepo = messageRepo;
    }
    toDTO(entity) {
        var _a, _b, _c;
        // If the entity is already populated, use it directly
        if (this.isPopulatedMessage(entity)) {
            return (0, dtos_1.toPublicMessageDTO)(entity);
        }
        // For non-populated messages, create a basic DTO
        return {
            _id: ((_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
            sender: {
                _id: "",
                username: "Unknown User",
                avatar: null
            },
            conversationId: ((_b = entity.conversationId) === null || _b === void 0 ? void 0 : _b.toString()) || "",
            content: entity.content || "",
            type: entity.type,
            media: entity.media || undefined,
            mentionedUsers: [],
            reactions: [],
            seenBy: [],
            isEdited: entity.isEdited,
            isDeleted: entity.isDeleted,
            replyTo: ((_c = entity.replyTo) === null || _c === void 0 ? void 0 : _c.toString()) || null,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    isPopulatedMessage(entity) {
        return entity !== null && typeof entity === 'object' && 'sender' in entity &&
            typeof entity.sender === 'object' &&
            'username' in entity.sender;
    }
    toDTOs(_) {
        return [];
    }
    addReaction(messageId, userId, emoji) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.messageRepo.addReaction(messageId, userId, emoji);
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Message not found");
            return this.mapOne(updated);
        });
    }
    removeReaction(messageId, userId, emoji) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.messageRepo.removeReaction(messageId, userId, emoji);
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Message not found");
            return this.mapOne(updated);
        });
    }
    toggleReaction(messageId, userId, emoji) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.messageRepo.getMessageById(messageId);
            if (!message)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Message not found");
            if (!Array.isArray(message.reactions)) {
                (message).reactions = [];
            }
            const idx = message.reactions.findIndex((r) => { var _a; return ((_a = r.userId) === null || _a === void 0 ? void 0 : _a.toString()) === userId; });
            if (idx !== -1) {
                const existing = message.reactions[idx];
                if (existing.emoji === emoji) {
                    message.reactions.splice(idx, 1);
                }
                else {
                    message.reactions[idx].emoji = emoji;
                }
            }
            else {
                // For non-populated messages, push ObjectId
                if (!this.isPopulatedMessage(message)) {
                    message.reactions.push({
                        userId: new mongoose_1.Types.ObjectId(userId),
                        emoji,
                    });
                }
                else {
                    // For populated messages, we need to handle this differently
                    // This should ideally be done at the repository level
                    throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "Cannot modify populated message directly");
                }
            }
            // If it's a populated message, we need to get the raw document first
            if (this.isPopulatedMessage(message)) {
                // Use repository methods instead of direct save for populated messages
                const updated = yield this.messageRepo.addReaction(messageId, userId, emoji);
                return updated ? this.toDTO(updated) : null;
            }
            const saved = yield this.messageRepo.save(message);
            return saved ? this.toDTO(saved) : null;
        });
    }
    markAsSeen(messageId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.messageRepo.markAsSeen(messageId, userId);
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Message not found");
            return this.mapOne(updated);
        });
    }
    markMessagesAsSeen(conversationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.messageRepo.markMessagesAsSeen(conversationId, userId);
        });
    }
}
exports.MessageEngagementService = MessageEngagementService;
