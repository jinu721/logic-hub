"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCodeWithPiston = void 0;
const axios_1 = __importDefault(require("axios"));
const runCodeWithPiston = (language_1, files_1, ...args_1) => __awaiter(void 0, [language_1, files_1, ...args_1], void 0, function* (language, files, options = {}) {
    var _a, _b, _c, _d, _e, _f, _g;
    console.log("FINAL REQUEST TO PISTON:", {
        language,
        files: files.map(f => f.name),
        options,
    });
    const pistonLangMap = {
        javascript: "javascript",
        typescript: "typescript",
        python: "python",
        java: "java",
        cpp: "c++",
        csharp: "csharp",
        go: "go",
        php: "php",
        ruby: "ruby",
        kotlin: "kotlin",
        swift: "swift",
    };
    const pistonLang = pistonLangMap[language] || language;
    const body = {
        language: pistonLang,
        version: "*",
        files,
        stdin: options.stdin || "",
        args: options.args || [],
    };
    // if (options.compileTimeoutMs !== undefined) body.compile_timeout = options.compileTimeoutMs;
    // if (options.runTimeoutMs !== undefined) body.run_timeout = options.runTimeoutMs;
    // if (options.compileMemoryLimitBytes !== undefined) body.compile_memory_limit = options.compileMemoryLimitBytes;
    // if (options.runMemoryLimitBytes !== undefined) body.run_memory_limit = options.runMemoryLimitBytes;
    const PISTON_URL = "https://emkc.org/api/v2/piston/execute";
    const response = yield axios_1.default.post(PISTON_URL, body, {
        timeout: (body.run_timeout || 10000) + 5000,
    });
    const data = response.data || {};
    const run = data.run || {};
    const stdout = (_a = run.stdout) !== null && _a !== void 0 ? _a : "";
    const stderr = (_b = run.stderr) !== null && _b !== void 0 ? _b : "";
    const output = (_c = run.output) !== null && _c !== void 0 ? _c : `${stdout}\n${stderr}`;
    const meta = {
        timedOut: false,
        memoryKilled: false,
        truncated: false,
        exitCode: (_d = run.code) !== null && _d !== void 0 ? _d : null,
        signal: (_e = run.signal) !== null && _e !== void 0 ? _e : null,
    };
    if (run.signal) {
        meta.timedOut = ["SIGKILL", "SIGTERM"].includes(run.signal);
    }
    if (run.code === null && run.signal)
        meta.timedOut = true;
    if (output.length > 20000)
        meta.truncated = true;
    return {
        raw: data,
        run: {
            stdout,
            stderr,
            output,
            code: (_f = run.code) !== null && _f !== void 0 ? _f : null,
            signal: (_g = run.signal) !== null && _g !== void 0 ? _g : null,
        },
        meta,
    };
});
exports.runCodeWithPiston = runCodeWithPiston;
