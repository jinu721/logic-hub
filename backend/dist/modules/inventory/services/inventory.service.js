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
exports.InventoryService = void 0;
const base_service_1 = require("../../../shared/core/base.service");
const dtos_1 = require("../../inventory/dtos");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
class InventoryService extends base_service_1.BaseService {
    constructor(repo, uploader) {
        super();
        this.repo = repo;
        this.uploader = uploader;
    }
    toDTO(entity) {
        const dto = (0, dtos_1.toPublicInventoryDTO)(entity);
        if (!dto)
            throw new Error("Mapped inventory item is undefined");
        return dto;
    }
    toDTOs(entities) {
        return (0, dtos_1.toPublicInventoryDTOs)(entities);
    }
    getPopulated(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.repo.getById(id);
            if (!item)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Item not found");
            return item;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.image) {
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "Image is required");
            }
            const uploaded = yield this.uploader.upload(data.image);
            const created = yield this.repo.create(Object.assign(Object.assign({}, data), { image: uploaded.id }));
            return this.mapOne(yield this.getPopulated(String(created._id)));
        });
    }
    getAll(search, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = search ? { name: { $regex: search, $options: "i" } } : {};
            const skip = (page - 1) * limit;
            const items = yield this.repo.getAll(query, skip, limit);
            return this.mapMany(items);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.repo.getById(id);
            if (!item)
                return null;
            return this.mapOne(item);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.repo.update(id, data);
            if (!updated)
                return null;
            return this.mapOne(yield this.getPopulated(id));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.delete(id);
        });
    }
}
exports.InventoryService = InventoryService;
