"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeModel = void 0;
const mongoose_1 = require("mongoose");
const testCaseSchema = new mongoose_1.Schema({
    input: { type: [mongoose_1.Schema.Types.Mixed], required: true },
    output: { type: mongoose_1.Schema.Types.Mixed, required: true },
    isHidden: { type: Boolean, default: false },
}, {
    _id: false,
});
const challengeDomainSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    instructions: { type: String, required: true },
    type: { type: String, enum: ["code", "cipher"], required: true },
    level: { type: String, enum: ["novice", "adept", "master"], required: true },
    testCases: {
        type: [testCaseSchema],
        required: function () {
            return this.type === "code";
        },
    },
    timeLimit: { type: Number, required: true },
    tags: { type: [String], required: true },
    hints: { type: [String], required: true },
    requiredSkills: { type: [String], required: true },
    isPremium: { type: Boolean, required: true },
    isKeyRequired: { type: Boolean, required: true },
    functionName: { type: String },
    parameters: [
        {
            name: { type: String, required: true },
            type: { type: String, required: true },
        },
    ],
    returnType: { type: String },
    initialCode: { type: mongoose_1.Schema.Types.Mixed },
    solutionCode: { type: mongoose_1.Schema.Types.Mixed },
    status: {
        type: String,
        enum: ["active", "inactive", "draft", "archived"],
        required: true,
    },
    isActive: { type: Boolean, required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    xpRewards: { type: Number, required: true },
});
exports.ChallengeModel = (0, mongoose_1.model)("Challenges", challengeDomainSchema);
