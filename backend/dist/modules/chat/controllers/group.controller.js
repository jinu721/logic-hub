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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupController = void 0;
const http_status_1 = require("../../../shared/constants/http.status");
const application_1 = require("../../../shared/utils/application");
const cloudinary_config_1 = __importDefault(require("../../../config/cloudinary.config"));
const dtos_1 = require("../../chat/dtos");
const group_query_dto_1 = require("../dtos/requests/group-query.dto");
class GroupController {
    constructor(_groupQuerySvc, _groupCommandSvc, _groupMemberSvc) {
        this._groupQuerySvc = _groupQuerySvc;
        this._groupCommandSvc = _groupCommandSvc;
        this._groupMemberSvc = _groupMemberSvc;
        this.createGroup = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.CreateGroupDto.from(req.body);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            const imgBuffer = req.file ? req.file.buffer : null;
            const group = yield this._groupCommandSvc.createGroup(dto, imgBuffer, userId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.CREATED, group);
        }));
        this.findByUser = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.GroupUserDto.from({ userId: req.params.userId });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const result = yield this._groupQuerySvc.findByUser(dto.userId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result);
        }));
        this.getAllGroups = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = group_query_dto_1.GroupQueryDto.fromQuery(req.query);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const result = yield this._groupQuerySvc.getAllGroups(dto);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result, "All groups fetched successfully");
        }));
        this.updateGroup = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.UpdateGroupDto.from({ groupId: req.params.groupId, payload: req.body });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const updated = yield this._groupCommandSvc.updateGroup(dto.groupId, dto.payload);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, updated);
        }));
        this.deleteGroup = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.DeleteGroupDto.from({ groupId: req.params.groupId });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            yield this._groupCommandSvc.deleteGroup(dto.groupId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, { success: true });
        }));
        this.addMembers = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.AddMembersDto.from({ groupId: req.params.groupId, memberIds: req.body.memberIds });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const result = yield this._groupMemberSvc.addMembers(dto.groupId, dto.memberIds);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result);
        }));
        this.removeMember = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.RemoveMemberDto.from({ groupId: req.params.groupId, userId: req.params.userId });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const result = yield this._groupMemberSvc.removeMember(dto.groupId, dto.userId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result);
        }));
        this.makeAdmin = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.AdminMemberDto.from(req.body);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const result = yield this._groupMemberSvc.makeAdmin(dto.conversationId, dto.groupId, dto.userId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result);
        }));
        this.removeAdmin = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.AdminMemberDto.from(req.body);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const result = yield this._groupMemberSvc.removeAdmin(dto.conversationId, dto.groupId, dto.userId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result);
        }));
        this.uploadProfile = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.file)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, "No file uploaded");
            const imageFile = `data:image/png;base64,${req.file.buffer.toString("base64")}`;
            const uploaded = yield cloudinary_config_1.default.v2.uploader.upload(imageFile, { folder: "groups" });
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, { imageUrl: uploaded.url }, "Image uploaded successfully");
        }));
        this.sendJoinRequest = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.JoinGroupDto.from({ groupId: req.params.groupId, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const updated = yield this._groupMemberSvc.sendJoinRequest(dto.groupId, dto.userId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, updated);
        }));
    }
}
exports.GroupController = GroupController;
