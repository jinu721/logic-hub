"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelModel = void 0;
const mongoose_1 = require("mongoose");
const levelRewardSchema = new mongoose_1.Schema({
    refType: {
        type: String,
        enum: ['Avatar', 'Banner', 'Badge'],
    },
    rewardId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: 'refType',
    },
    type: { type: String, enum: ['avatar', 'banner', 'badge'], required: true },
    name: { type: String, required: true },
    rewardDescription: { type: String, required: true },
}, { _id: false });
const levelSchema = new mongoose_1.Schema({
    levelNumber: { type: Number, required: true, unique: true },
    requiredXP: { type: Number, required: true },
    rewards: { type: [levelRewardSchema], required: true },
    description: { type: String, required: true },
}, {
    timestamps: true,
});
exports.LevelModel = (0, mongoose_1.model)("Level", levelSchema);
