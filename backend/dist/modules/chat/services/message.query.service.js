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
exports.MessageQueryService = void 0;
const _core_1 = require("../../../shared/core");
const dtos_1 = require("../../chat/dtos");
class MessageQueryService extends _core_1.BaseService {
    constructor(messageRepo) {
        super();
        this.messageRepo = messageRepo;
    }
    toDTO(entity) {
        return (0, dtos_1.toPublicMessageDTO)(entity);
    }
    toDTOs(entities) {
        return (0, dtos_1.toPublicMessageDTOs)(entities);
    }
    getMessages(limit, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield this.messageRepo.getMessages(limit, query);
            return this.mapMany(messages);
        });
    }
    getMessageById(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.messageRepo.getMessageById(messageId);
            if (!message)
                return null;
            return this.mapOne(message);
        });
    }
}
exports.MessageQueryService = MessageQueryService;
