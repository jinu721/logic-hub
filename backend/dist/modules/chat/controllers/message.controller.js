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
exports.MessageController = void 0;
const _constants_1 = require("../../../shared/constants");
const application_1 = require("../../../shared/utils/application");
class MessageController {
    constructor(querySvc, commandSvc, engagementSvc) {
        this.querySvc = querySvc;
        this.commandSvc = commandSvc;
        this.engagementSvc = engagementSvc;
        this.getMessages = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const limit = Number(req.query.limit) || 10;
            const query = Object.assign({}, req.query);
            delete query.limit;
            const messages = yield this.querySvc.getMessages(limit, query);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, messages, "Messages fetched successfully");
        }));
        this.editMessage = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { messageId, newText } = req.body;
            if (!messageId || !newText) {
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "messageId and newText are required");
            }
            const result = yield this.commandSvc.editMessage(messageId, newText);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result, "Message edited successfully");
        }));
        this.deleteMessage = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { messageId } = req.params;
            if (!messageId) {
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "messageId is required");
            }
            const result = yield this.commandSvc.deleteMessage(messageId);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result, "Message deleted successfully");
        }));
        this.addReaction = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { messageId, userId, reaction } = req.body;
            if (!messageId || !userId || !reaction) {
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "messageId, userId and reaction are required");
            }
            const result = yield this.engagementSvc.addReaction(messageId, userId, reaction);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result, "Reaction added successfully");
        }));
        this.removeReaction = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { messageId, userId, reaction } = req.body;
            if (!messageId || !userId || !reaction) {
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "messageId, userId and reaction are required");
            }
            const result = yield this.engagementSvc.removeReaction(messageId, userId, reaction);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result, "Reaction removed successfully");
        }));
        this.markAsSeen = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { messageId, userId } = req.body;
            if (!messageId || !userId) {
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "messageId and userId are required");
            }
            const result = yield this.engagementSvc.markAsSeen(messageId, userId);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result, "Message marked as seen");
        }));
        this.getMessageById = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { messageId } = req.params;
            if (!messageId) {
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "messageId is required");
            }
            const result = yield this.querySvc.getMessageById(messageId);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result, "Message fetched successfully");
        }));
        this.uploadMessage = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            const { type } = req.body;
            if (!file || !type) {
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "File and type are required");
            }
            const uploadedUrl = yield (0, application_1.uploadFile)(file, type);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { url: uploadedUrl }, "File uploaded successfully");
        }));
    }
}
exports.MessageController = MessageController;
