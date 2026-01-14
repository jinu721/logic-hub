"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportGroupFields = exports.ReportFilters = void 0;
exports.ReportFilters = {
    open: { status: "open" },
    closed: { status: "closed" },
    pending: { status: "pending" },
};
exports.ReportGroupFields = ["status", "type", "user"];
