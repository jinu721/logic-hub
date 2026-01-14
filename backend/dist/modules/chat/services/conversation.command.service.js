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
exports.ConversationCommandService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const dtos_1 = require("../../chat/dtos");
class ConversationCommandService extends _core_1.BaseService {
    constructor(conversationRepo) {
        super();
        this.conversationRepo = conversationRepo;
    }
    toDTO(entity) {
        return (0, dtos_1.toPublicConversationDTO)(entity);
    }
    toDTOs(entities) {
        return entities.map(e => (0, dtos_1.toPublicConversationDTO)(e));
    }
    getPopulated(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield this.conversationRepo.findConversationById(id);
            if (!conversation)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            return conversation;
        });
    }
    createOneToOne(userA, userB) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.conversationRepo.findOneToOne(userA, userB);
            if (existing)
                return String(existing._id);
            const created = yield this.conversationRepo.createOneToOne(userA, userB);
            if (!created)
                throw new application_1.AppError(_constants_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create conversation");
            return String(created._id);
        });
    }
    updateLastMessage(conversationId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.conversationRepo.updateLastMessage(conversationId, messageId);
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            return this.mapOne(yield this.getPopulated(conversationId));
        });
    }
    addUnreadCounts(conversationId, userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.conversationRepo.addUnreadCountsForUsers(conversationId, userIds);
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            // Ensure we fetch the completely fresh populated conversation
            const populated = yield this.getPopulated(conversationId);
            return this.mapOne(populated);
        });
    }
    markAsRead(conversationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.conversationRepo.markRead(conversationId, userId);
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            return this.mapOne(yield this.getPopulated(conversationId));
        });
    }
}
exports.ConversationCommandService = ConversationCommandService;
