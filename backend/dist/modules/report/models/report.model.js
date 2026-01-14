"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModel = void 0;
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    reporter: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportedType: {
        type: String,
        enum: ['User', 'Room', 'Group'],
        required: true
    },
    reportedId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
exports.ReportModel = (0, mongoose_1.model)('Report', reportSchema);
