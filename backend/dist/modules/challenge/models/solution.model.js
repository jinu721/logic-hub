"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolutionModel = void 0;
const mongoose_1 = require("mongoose");
const solutionSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    challenge: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Challenge', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    implementations: {
        type: [{
                language: { type: String, required: true },
                codeSnippet: { type: String, required: true }
            }],
        default: []
    },
    likes: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    comments: {
        type: [{
                user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
                content: { type: String, required: true },
                commentedAt: { type: Date, default: Date.now }
            }],
        default: []
    }
}, { timestamps: true });
exports.SolutionModel = (0, mongoose_1.model)('Solution', solutionSchema);
