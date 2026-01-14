"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const { combine, timestamp, errors, printf, colorize } = winston_1.format;
const blockFormat = printf((_a) => {
    var { timestamp, level, message, stack } = _a, meta = __rest(_a, ["timestamp", "level", "message", "stack"]);
    let logLines = [
        "==================== LOG START ====================",
        `🕒 Time   : ${timestamp}`,
        `🔖 Level  : ${level.toUpperCase()}`,
        `💬 Message: ${message}`,
    ];
    if (stack)
        logLines.push(`🧾 Stack  :\n${stack}`);
    if (meta.error) {
        const err = meta.error;
        if (err instanceof Error) {
            logLines.push(`🧾 MetaErr: ${err.stack || err.message}`);
        }
        else {
            logLines.push(`🧾 MetaErr: ${JSON.stringify(err)}`);
        }
    }
    logLines.push("==================== LOG END ======================\n");
    return logLines.join("\n");
});
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: combine(timestamp(), errors({ stack: true }), blockFormat),
    transports: [
        new winston_1.transports.Console({
            format: combine(colorize(), timestamp(), errors({ stack: true }), blockFormat),
        }),
        new winston_daily_rotate_file_1.default({
            filename: "logs/error-%DATE%.log",
            level: "error",
            datePattern: "YYYY-MM-DD",
            maxFiles: "7d",
            zippedArchive: true,
            format: combine(timestamp(), errors({ stack: true }), blockFormat),
        }),
        new winston_daily_rotate_file_1.default({
            filename: "logs/combined-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "14d",
            zippedArchive: true,
            format: combine(timestamp(), errors({ stack: true }), blockFormat),
        }),
    ],
});
exports.default = logger;
