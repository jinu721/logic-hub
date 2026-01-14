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
exports.MarketRepository = void 0;
const market_1 = require("../../market");
const _core_1 = require("../../../shared/core");
class MarketRepository extends _core_1.BaseRepository {
    constructor() {
        super(market_1.MarketModel);
    }
    createItem(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create(data);
        });
    }
    getAllItems(query, sort, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.model.find(query).sort(Object.assign({ createdAt: -1 }, sort)).skip(skip).limit(limit);
            // Auto-fix missing itemModel for population on legacy data
            items.forEach(item => {
                if (!item.itemModel && item.category) {
                    const itemModelMap = {
                        'avatar': 'Avatar',
                        'banner': 'Banner',
                        'badge': 'Badge'
                    };
                    item.itemModel = itemModelMap[item.category] || 'Avatar';
                }
            });
            yield this.model.populate(items, { path: 'itemId' });
            items.forEach(item => {
                const isPopulated = item.itemId && typeof item.itemId === 'object' && 'name' in item.itemId;
                if (!isPopulated) {
                    console.log(`[MarketRepo] Item ${item._id} (${item.name}) itemId STILL NOT populated. itemModel: ${item.itemModel}, category: ${item.category}`);
                }
            });
            return items;
        });
    }
    countMarketItems(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.countDocuments(query);
        });
    }
    getItemById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.model.findById(id);
            if (item) {
                if (!item.itemModel && item.category) {
                    const itemModelMap = {
                        'avatar': 'Avatar',
                        'banner': 'Banner',
                        'badge': 'Badge'
                    };
                    item.itemModel = itemModelMap[item.category] || 'Avatar';
                }
                yield item.populate('itemId');
            }
            return item;
        });
    }
    updateItem(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.model.findByIdAndUpdate(id, update, { new: true });
            if (item) {
                if (!item.itemModel && item.category) {
                    const itemModelMap = {
                        'avatar': 'Avatar',
                        'banner': 'Banner',
                        'badge': 'Badge'
                    };
                    item.itemModel = itemModelMap[item.category] || 'Avatar';
                }
                yield item.populate('itemId');
            }
            return item;
        });
    }
    deleteItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findByIdAndDelete(id);
            return !!result;
        });
    }
}
exports.MarketRepository = MarketRepository;
