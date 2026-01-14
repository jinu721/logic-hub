"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicInventoryDTOs = exports.toPublicInventoryDTO = void 0;
const application_1 = require("../../../../shared/utils/application");
const toPublicInventoryDTO = (item) => {
    if (!item)
        return;
    return {
        _id: item._id.toString(),
        name: item.name,
        description: item.description,
        image: (0, application_1.generateSignedImageUrl)(item.image),
        isActive: item.isActive,
        rarity: item.rarity,
    };
};
exports.toPublicInventoryDTO = toPublicInventoryDTO;
const toPublicInventoryDTOs = (items) => {
    return items.map((item) => (0, exports.toPublicInventoryDTO)(item)).filter(Boolean);
};
exports.toPublicInventoryDTOs = toPublicInventoryDTOs;
