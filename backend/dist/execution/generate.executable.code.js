"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExecutableFiles = generateExecutableFiles;
const wrappers_1 = require("./wrappers");
const _execution_1 = require(".");
function generateExecutableFiles(language, userCode, funcName) {
    const lang = (language || "").toLowerCase();
    if (lang === "typescript" || lang === "ts") {
        const jsCode = (0, _execution_1.transpileTsToJs)(userCode);
        return [(0, wrappers_1.jsWrapper)(jsCode, funcName)];
    }
    switch (lang) {
        case "javascript":
        case "js":
            return [(0, wrappers_1.jsWrapper)(userCode, funcName)];
        case "python":
        case "py":
            return [(0, wrappers_1.pythonWrapper)(userCode, funcName)];
        case "ruby":
            return [(0, wrappers_1.rubyWrapper)(userCode, funcName)];
        case "php":
            return [(0, wrappers_1.phpWrapper)(userCode, funcName)];
        case "dart":
            return [(0, wrappers_1.dartWrapper)(userCode, funcName)];
        default:
            throw new Error("Unsupported language: " + language);
    }
}
