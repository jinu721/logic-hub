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
exports.GroupCommandService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const dtos_1 = require("../../chat/dtos");
const mongoose_1 = require("mongoose");
const cloudinary_config_1 = __importDefault(require("../../../config/cloudinary.config"));
class GroupCommandService extends _core_1.BaseService {
    constructor(groupRepo, conversationRepo) {
        super();
        this.groupRepo = groupRepo;
        this.conversationRepo = conversationRepo;
    }
    toDTO(entity) {
        return (0, dtos_1.toPublicGroupDTO)(entity);
    }
    toDTOs(_) {
        return [];
    }
    createGroup(data, imageBuffer, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!userId)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "userId is required");
            const createdBy = new mongoose_1.Types.ObjectId(userId);
            if (imageBuffer) {
                const base64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;
                const uploaded = yield cloudinary_config_1.default.v2.uploader.upload(base64, { folder: "groupImages" });
                data.image = uploaded.secure_url;
            }
            const group = yield this.groupRepo.createGroup(Object.assign(Object.assign({}, data), { createdBy, admins: [createdBy], members: data.members ? data.members.map(id => new mongoose_1.Types.ObjectId(id)) : [], userRequests: [], groupType: data.groupType || 'public-open' }));
            if (!group)
                throw new application_1.AppError(_constants_1.HttpStatus.INTERNAL_SERVER_ERROR, "Group not created");
            yield this.conversationRepo.createGroup([createdBy.toString()], (_b = (_a = group._id) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "");
            return this.mapOne(group);
        });
    }
    updateGroup(groupId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.groupRepo.updateGroup(groupId, data);
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Group not found");
            return this.mapOne(updated);
        });
    }
    deleteGroup(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.groupRepo.deleteGroup(groupId);
            return true;
        });
    }
    updateGroupInfo(conversationId, groupId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.groupRepo.updateGroupDetails(groupId, data);
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Group not found");
            return this.mapOne(updated);
        });
    }
}
exports.GroupCommandService = GroupCommandService;
