"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTestCase = void 0;
const parseTestCase = (value) => {
    if (typeof value !== "string")
        return value;
    try {
        return JSON.parse(value);
    }
    catch (e) {
        return value;
    }
};
exports.parseTestCase = parseTestCase;
