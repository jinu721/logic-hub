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
exports.ConversationTypingService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const dtos_1 = require("../../chat/dtos");
class ConversationTypingService extends _core_1.BaseService {
    constructor(conversationRepo) {
        super();
        this.conversationRepo = conversationRepo;
    }
    toDTO(entity) {
        var _a;
        // Handle both populated and non-populated conversations
        if (this.isPopulatedConversation(entity)) {
            return (0, dtos_1.toPublicConversationDTO)(entity);
        }
        // For non-populated, return basic structure
        return {
            _id: ((_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
            type: entity.type,
            participants: [],
            latestMessage: null,
            isDeleted: entity.isDeleted,
            typingUsers: [],
            unreadCounts: entity.unreadCounts instanceof Map
                ? Object.fromEntries(entity.unreadCounts)
                : entity.unreadCounts || {},
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    isPopulatedConversation(conv) {
        return conv !== null && typeof conv === 'object' && 'participants' in conv &&
            Array.isArray(conv.participants) &&
            conv.participants.length > 0 &&
            typeof conv.participants[0] === 'object' &&
            'username' in conv.participants[0];
    }
    toDTOs(entities) {
        return entities.map(e => this.toDTO(e));
    }
    setTypingUser(conversationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.conversationRepo.setTypingUser(conversationId, userId);
            console.log("Updatedd", updated);
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            return this.mapOne(updated);
        });
    }
    removeTypingUser(conversationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.conversationRepo.removeTypingUser(conversationId, userId);
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            return this.mapOne(updated);
        });
    }
    getTypingUsers(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.conversationRepo.getTypingUsers(conversationId);
            return users.map((u) => (u === null || u === void 0 ? void 0 : u.toString()) || "");
        });
    }
}
exports.ConversationTypingService = ConversationTypingService;
