"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractUserLogs = void 0;
const extractUserLogs = (stdout) => {
    const startMarker = '===USER_LOGS_START===';
    const endMarker = '===USER_LOGS_END===';
    const startIndex = stdout.indexOf(startMarker);
    const endIndex = stdout.indexOf(endMarker);
    if (startIndex === -1 || endIndex === -1) {
        return '';
    }
    return stdout.substring(startIndex + startMarker.length, endIndex).trim();
};
exports.extractUserLogs = extractUserLogs;
