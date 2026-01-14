"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateExpiry = void 0;
const date_fns_1 = require("date-fns");
const calculateExpiry = (planType, startDate) => {
    switch (planType) {
        case "silver":
            return (0, date_fns_1.addMonths)(startDate, 1);
        case "gold":
            return (0, date_fns_1.addYears)(startDate, 1);
        default:
            throw new Error(`Unsupported plan type: ${planType}`);
    }
};
exports.calculateExpiry = calculateExpiry;
