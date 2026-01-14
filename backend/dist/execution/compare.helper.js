"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepEqual = deepEqual;
function deepEqual(a, b) {
    if (a === b)
        return true;
    if (a == null || b == null)
        return a === b;
    if (areNumbers(a, b)) {
        return Math.abs(Number(a) - Number(b)) < 1e-9;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length)
            return false;
        for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i]))
                return false;
        }
        return true;
    }
    if (isPlainObject(a) && isPlainObject(b)) {
        const aKeys = Object.keys(a).sort();
        const bKeys = Object.keys(b).sort();
        if (aKeys.length !== bKeys.length)
            return false;
        for (let i = 0; i < aKeys.length; i++) {
            const key = aKeys[i];
            if (key !== bKeys[i])
                return false;
            const aValue = a[key];
            const bValue = b[key];
            if (!deepEqual(aValue, bValue))
                return false;
        }
        return true;
    }
    try {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    catch (_a) {
        return false;
    }
}
function isPlainObject(value) {
    return value !== null && typeof value === 'object' && Object.prototype.toString.call(value) === "[object Object]";
}
function areNumbers(a, b) {
    const aNum = typeof a === "string" || typeof a === "number" ? Number(a) : NaN;
    const bNum = typeof b === "string" || typeof b === "number" ? Number(b) : NaN;
    return !Number.isNaN(aNum) && !Number.isNaN(bNum);
}
