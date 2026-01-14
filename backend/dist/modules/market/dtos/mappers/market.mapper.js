"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicMarketItemDTOs = exports.toPublicMarketItemDTO = void 0;
const inventory_1 = require("../../../inventory");
const toPublicMarketItemDTO = (item) => {
    const isPopulated = (obj) => {
        return obj && typeof obj === 'object' && ('name' in obj || obj instanceof Object && obj.constructor.name !== 'ObjectId');
    };
    return {
        _id: item._id ? item._id.toString() : "",
        name: item.name,
        description: item.description,
        costXP: item.costXP,
        itemId: isPopulated(item.itemId) ? ((0, inventory_1.toPublicInventoryDTO)(item.itemId) || {
            _id: "",
            name: "Unknown Item",
            description: "",
            image: "",
            isActive: false,
            rarity: "common"
        }) : {
            _id: item.itemId ? item.itemId.toString() : "",
            name: "Unpopulated Item",
            description: "This item's details could not be loaded.",
            image: "",
            isActive: false,
            rarity: "common"
        },
        category: item.category,
        available: item.available,
        limitedTime: item.limitedTime,
        isExclusive: item.isExclusive,
        expiresAt: item.expiresAt,
        createdAt: item.createdAt,
    };
};
exports.toPublicMarketItemDTO = toPublicMarketItemDTO;
const toPublicMarketItemDTOs = (items) => {
    return items.map(exports.toPublicMarketItemDTO);
};
exports.toPublicMarketItemDTOs = toPublicMarketItemDTOs;
