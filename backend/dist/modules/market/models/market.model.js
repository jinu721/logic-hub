"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketModel = void 0;
const mongoose_1 = require("mongoose");
const marketItemSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    costXP: {
        type: Number,
        required: true,
    },
    itemId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: 'itemModel',
    },
    itemModel: {
        type: String,
        required: true,
        enum: ['Avatar', 'Banner', 'Badge']
    },
    category: {
        type: String,
        enum: ['avatar', 'banner', 'badge'],
        required: true
    },
    available: {
        type: Boolean,
        default: true,
    },
    limitedTime: {
        type: Boolean,
        default: false,
    },
    isExclusive: {
        type: Boolean,
        default: false,
    },
    expiresAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
marketItemSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function () {
});
marketItemSchema.post('init', function (doc) {
    if (!doc.itemModel && doc.category) {
        const map = {
            'avatar': 'Avatar',
            'banner': 'Banner',
            'badge': 'Badge'
        };
        doc.itemModel = map[doc.category] || 'Avatar';
    }
});
marketItemSchema.pre('save', function (next) {
    if (!this.itemModel && this.category) {
        const map = {
            'avatar': 'Avatar',
            'banner': 'Banner',
            'badge': 'Badge'
        };
        this.itemModel = map[this.category] || 'Avatar';
    }
    next();
});
exports.MarketModel = (0, mongoose_1.model)('MarketItem', marketItemSchema);
