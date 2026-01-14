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
exports.MarketService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const market_1 = require("../../market");
class MarketService extends _core_1.BaseService {
    constructor(marketRepo, userRepo) {
        super();
        this.marketRepo = marketRepo;
        this.userRepo = userRepo;
    }
    toDTO(item) {
        return (0, market_1.toPublicMarketItemDTO)(item);
    }
    toDTOs(items) {
        return (0, market_1.toPublicMarketItemDTOs)(items);
    }
    createItem(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield this.marketRepo.createItem(data);
            return this.mapOne(created);
        });
    }
    getAllItems() {
        return __awaiter(this, arguments, void 0, function* (filter = {}, page = 1, limit = 10) {
            const query = {};
            const sort = {};
            if (filter.category)
                query.category = filter.category;
            if (filter.searchQuery)
                query.name = { $regex: filter.searchQuery, $options: "i" };
            if (filter.sortOption === "limited")
                query.limitedTime = true;
            else if (filter.sortOption === "exclusive")
                query.isExclusive = true;
            else if (filter.sortOption === "price-asc")
                sort.costXP = 1;
            else if (filter.sortOption === "price-desc")
                sort.costXP = -1;
            const skip = (page - 1) * limit;
            const items = yield this.marketRepo.getAllItems(query, sort, skip, limit);
            const totalItems = yield this.marketRepo.countMarketItems(query);
            return { marketItems: this.mapMany(items), totalItems };
        });
    }
    getItemById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.marketRepo.getItemById(id);
            if (!item)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Item not found");
            return this.mapOne(item);
        });
    }
    updateItem(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.marketRepo.updateItem(id, data);
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Item not found");
            return this.mapOne(updated);
        });
    }
    deleteItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.marketRepo.deleteItem(id);
            if (!deleted)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Item not found");
            return true;
        });
    }
}
exports.MarketService = MarketService;
