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
exports.MarketController = void 0;
const http_status_1 = require("../../../shared/constants/http.status");
const dtos_1 = require("../../market/dtos");
const application_1 = require("../../../shared/utils/application");
class MarketController {
    constructor(_marketSvc) {
        this._marketSvc = _marketSvc;
        this.createItem = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.CreateMarketItemDto.from(req.body);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const itemModelMap = {
                'avatar': 'Avatar',
                'banner': 'Banner',
                'badge': 'Badge'
            };
            const result = yield this._marketSvc.createItem(Object.assign(Object.assign({}, dto), { itemId: (0, application_1.toObjectId)(dto.itemId), category: dto.category, itemModel: itemModelMap[dto.category] || 'Avatar' }));
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.CREATED, result, "Item created successfully");
        }));
        this.getAllItems = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.GetAllMarketItemsDto.from(req.query);
            const validation = dto.validate();
            if (!validation.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const filter = {
                category: dto.category,
                searchQuery: dto.searchQuery,
                sortOption: dto.sortOption,
            };
            const page = dto.page ? Number(dto.page) : 1;
            const limit = dto.limit ? Number(dto.limit) : 10;
            const result = yield this._marketSvc.getAllItems(filter, page, limit);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result, "Items fetched successfully");
        }));
        this.getItemById = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.GetMarketItemDto.from(req.params);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const result = yield this._marketSvc.getItemById(dto.id);
            if (!result) {
                throw new application_1.AppError(http_status_1.HttpStatus.NOT_FOUND, "Item not found");
            }
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result, "Item fetched successfully");
        }));
        this.updateItem = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.UpdateMarketItemDto.from(Object.assign({ id: req.params.id }, req.body));
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const updateData = {};
            Object.keys(dto).forEach(key => {
                if (key !== 'itemId') {
                    updateData[key] = dto[key];
                }
            });
            if (dto.itemId) {
                updateData.itemId = (0, application_1.toObjectId)(dto.itemId);
            }
            if (dto.category) {
                updateData.category = dto.category;
                const itemModelMap = {
                    'avatar': 'Avatar',
                    'banner': 'Banner',
                    'badge': 'Badge'
                };
                updateData.itemModel = itemModelMap[dto.category];
            }
            const result = yield this._marketSvc.updateItem(dto.id, updateData);
            if (!result) {
                throw new application_1.AppError(http_status_1.HttpStatus.NOT_FOUND, "Item not found");
            }
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result, "Item updated successfully");
        }));
        this.deleteItem = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.DeleteMarketItemDto.from(req.params);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const result = yield this._marketSvc.deleteItem(dto.id);
            if (!result) {
                throw new application_1.AppError(http_status_1.HttpStatus.NOT_FOUND, "Item not found");
            }
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, null, "Item deleted successfully");
        }));
    }
}
exports.MarketController = MarketController;
