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
exports.InventoryController = void 0;
const _constants_1 = require("../../../shared/constants");
const application_1 = require("../../../shared/utils/application");
const dtos_1 = require("../../inventory/dtos");
class InventoryController {
    constructor(svc) {
        this.svc = svc;
        this.create = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.CreateInventoryDto.from(req.body);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            let imageFile = "";
            if (req.file) {
                const mime = req.file.mimetype;
                const base64 = req.file.buffer.toString("base64");
                imageFile = `data:${mime};base64,${base64}`;
            }
            const payload = Object.assign(Object.assign({}, dto), { image: imageFile, rarity: dto.rarity });
            const data = yield this.svc.create(payload);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { data }, "Created");
        }));
        this.getAll = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.GetAllInventoryDto.from(req.query);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const search = dto.search || "";
            const page = dto.page ? Number(dto.page) : 1;
            const limit = dto.limit ? Number(dto.limit) : 10;
            const searchQuery = search || "";
            const data = yield this.svc.getAll(searchQuery, page, limit);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { data }, "Fetched");
        }));
        this.getById = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.GetInventoryDto.from(req.params);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const data = yield this.svc.getById(dto.id);
            if (!data)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Not Found");
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { data }, "Fetched");
        }));
        this.update = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.UpdateInventoryDto.from(req.body);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const idDto = dtos_1.GetInventoryDto.from(req.params);
            const validId = idDto.validate();
            if (!validId.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, validId.errors.join(","));
            const updateData = {};
            Object.keys(dto).forEach(key => {
                if (key !== 'rarity') {
                    updateData[key] = dto[key];
                }
            });
            if (dto.rarity) {
                updateData.rarity = dto.rarity;
            }
            const data = yield this.svc.update(idDto.id, updateData);
            if (!data)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Not Found");
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, { data }, "Updated");
        }));
        this.delete = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.DeleteInventoryDto.from(req.params);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const deleted = yield this.svc.delete(dto.id);
            if (!deleted)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Not Found");
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, {}, "Deleted");
        }));
    }
}
exports.InventoryController = InventoryController;
