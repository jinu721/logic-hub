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
exports.ConversationController = void 0;
const dtos_1 = require("../../chat/dtos");
const _constants_1 = require("../../../shared/constants");
const application_1 = require("../../../shared/utils/application");
class ConversationController {
    constructor(_convCommandSvc, _convQuerySvc, _convTypingSvc) {
        this._convCommandSvc = _convCommandSvc;
        this._convQuerySvc = _convQuerySvc;
        this._convTypingSvc = _convTypingSvc;
        this.createOneToOne = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log(req.body);
            const dto = dtos_1.CreateOneToOneDto.from(req.body);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_a = valid.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const currentUserId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
            if (!currentUserId)
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            const conversation = yield this._convCommandSvc.createOneToOne(dto.userId, currentUserId);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.CREATED, { success: true, data: conversation });
        }));
        this.findOneToOne = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.FindOneToOneDto.from({ userA: req.params.userA, userB: req.params.userB });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_a = valid.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const conversation = yield this._convQuerySvc.findOneToOne(dto.userA, dto.userB);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { success: true, data: conversation });
        }));
        this.findConversation = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const dto = dtos_1.FindConversationDto.from({
                conversationId: req.params.conversationId,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId
            });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_b = valid.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            const conversation = yield this._convQuerySvc.findConversation(dto.conversationId, dto.userId);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { success: true, data: conversation });
        }));
        this.findConversationByUser = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userIdParam = req.params.id === "me" ? (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId : req.params.id;
            const dto = dtos_1.FindConversationsByUserDto.from({ userId: userIdParam });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_b = valid.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            const conversation = yield this._convQuerySvc.findConversations(dto.userId, req.query);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { success: true, data: conversation });
        }));
        this.findConversationByGroup = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.FindConversationGroupDto.from({ groupId: req.params.groupId });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_a = valid.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const conversation = yield this._convQuerySvc.findConversationByGroup(dto.groupId);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { success: true, data: conversation });
        }));
        this.setTypingUser = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.TypingUserDto.from(req.body);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_a = valid.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const updated = yield this._convTypingSvc.setTypingUser(dto.conversationId, dto.userId);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { success: true, data: updated });
        }));
        this.removeTypingUser = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.TypingUserDto.from(req.body);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_a = valid.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const updated = yield this._convTypingSvc.removeTypingUser(dto.conversationId, dto.userId);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { success: true, data: updated });
        }));
        this.getTypingUsers = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.GetTypingUsersDto.from({ conversationId: req.params.conversationId });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_a = valid.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const users = yield this._convTypingSvc.getTypingUsers(dto.conversationId);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { success: true, data: users });
        }));
    }
}
exports.ConversationController = ConversationController;
