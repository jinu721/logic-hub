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
exports.GroupQueryService = void 0;
const _core_1 = require("../../../shared/core");
const dtos_1 = require("../../chat/dtos");
class GroupQueryService extends _core_1.BaseService {
    constructor(groupRepo) {
        super();
        this.groupRepo = groupRepo;
    }
    toDTO(entity) {
        return (0, dtos_1.toPublicGroupDTO)(entity);
    }
    toDTOs(entities) {
        return (0, dtos_1.toPublicGroupDTOs)(entities);
    }
    findByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { $or: [{ createdBy: userId }, { admins: userId }] };
            const groups = yield this.groupRepo.getAllGroups(query, 0, 0);
            return this.mapMany(groups || []);
        });
    }
    findGroupById(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.groupRepo.findGroupById(groupId);
            return group ? this.mapOne(group) : null;
        });
    }
    getAllGroups(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            const page = filter.page ? Number(filter.page) : 1;
            const limit = filter.limit ? Number(filter.limit) : 0;
            const skip = (page - 1) * limit;
            if (filter.type && filter.type !== "all") {
                query.groupType = filter.type;
            }
            if (filter.search) {
                query.name = { $regex: filter.search, $options: "i" };
            }
            if (filter.category && filter.category !== "all") {
                query.category = filter.category;
            }
            if (filter.tags) {
                const tagsArray = Array.isArray(filter.tags) ? filter.tags : filter.tags.$in;
                if (Array.isArray(tagsArray) && tagsArray.length > 0) {
                    query.tags = { $in: tagsArray };
                }
            }
            console.log("GROUP FETCHING STARTED WITH QUERY: ", query);
            const groups = yield this.groupRepo.getAllGroups(query, skip, limit);
            const totalItems = yield this.groupRepo.countAllGroups(query);
            console.log("GROUP FETCHING ENDED");
            return {
                groups: this.mapMany(groups),
                totalItems,
            };
        });
    }
}
exports.GroupQueryService = GroupQueryService;
