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
exports.MessageCommandService = void 0;
const _core_1 = require("../../../shared/core");
const dtos_1 = require("../../chat/dtos");
const token_1 = require("../../../shared/utils/token");
const mongoose_1 = require("mongoose");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
class MessageCommandService extends _core_1.BaseService {
    constructor(messageRepo) {
        super();
        this.messageRepo = messageRepo;
    }
    toDTO(entity) {
        return (0, dtos_1.toPublicMessageDTO)(entity);
    }
    toDTOs(entities) {
        return entities.map(e => (0, dtos_1.toPublicMessageDTO)(e));
    }
    getPopulated(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.messageRepo.getMessageById(id);
            if (!message)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Message not found");
            return message;
        });
    }
    createMessage(data, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const SYSTEM_USER_ID = new mongoose_1.Types.ObjectId("000000000000000000000000");
            let sender;
            if (accessToken) {
                const user = (0, token_1.verifyAccessToken)(accessToken);
                if (!user)
                    throw new Error("Unauthorized");
                sender = new mongoose_1.Types.ObjectId(user.userId);
            }
            else {
                sender = SYSTEM_USER_ID;
            }
            const messageInput = {
                sender,
                conversationId: typeof data.conversationId === 'string' ? new mongoose_1.Types.ObjectId(data.conversationId) : data.conversationId,
                content: data.content,
                type: data.type || 'text',
                mentionedUsers: [],
                seenBy: [],
                isEdited: false,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const message = yield this.messageRepo.createMessage(messageInput);
            return this.mapOne(yield this.getPopulated(String(message._id)));
        });
    }
    createMessageWithSender(data, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const SYSTEM_USER_ID = new mongoose_1.Types.ObjectId("000000000000000000000000");
            let sender;
            if (accessToken) {
                const user = (0, token_1.verifyAccessToken)(accessToken);
                if (!user)
                    throw new Error("Unauthorized");
                sender = new mongoose_1.Types.ObjectId(user.userId);
            }
            else {
                sender = SYSTEM_USER_ID;
            }
            const message = yield this.messageRepo.createMessage(Object.assign(Object.assign({}, data), { sender }));
            return this.mapOne(yield this.getPopulated(String(message._id)));
        });
    }
    editMessage(messageId, newText) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.messageRepo.editMessage(messageId, newText);
            if (!updated)
                return null;
            return this.mapOne(yield this.getPopulated(messageId));
        });
    }
    deleteMessage(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.messageRepo.deleteMessage(messageId);
            if (!deleted)
                return null;
            return this.mapOne(yield this.getPopulated(messageId));
        });
    }
}
exports.MessageCommandService = MessageCommandService;
