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
exports.runCodeWithJudge0 = void 0;
const axios_1 = __importDefault(require("axios"));
const runCodeWithJudge0 = (languageId_1, sourceCode_1, ...args_1) => __awaiter(void 0, [languageId_1, sourceCode_1, ...args_1], void 0, function* (languageId, sourceCode, stdin = "") {
    var _a, _b;
    //   const JUDGE0_URL = "http://16.16.182.216:2358/submissions?wait=true";
    const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
    //   const response = await axios.post(JUDGE0_URL, {
    //     language_id: languageId,
    //     source_code: files[0].content,
    //     stdin: stdin
    //   });
    const response = yield axios_1.default.post(JUDGE0_URL, {
        language_id: languageId,
        source_code: sourceCode,
        stdin: stdin,
    }, {
        headers: {
            "X-RapidAPI-Key": "89e6b7db7cmshfb847498a7c7e66p1bc5ccjsnb6232f2fbd6e",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "Content-Type": "application/json",
        },
    });
    const data = response.data;
    return {
        run: {
            stdout: data.stdout || "",
            stderr: data.stderr || "",
            resultStatus: ((_a = data.status) === null || _a === void 0 ? void 0 : _a.description) || "",
            statusId: ((_b = data.status) === null || _b === void 0 ? void 0 : _b.id) || null,
            time: data.time ? Number(data.time) : null,
            memory: data.memory ? Number(data.memory) : null,
            cpuTime: data.cpu_time ? Number(data.cpu_time) : null,
            compileOutput: data.compile_output || null,
            output: (data.stdout || "") + (data.stderr || "")
        },
        raw: data
    };
});
exports.runCodeWithJudge0 = runCodeWithJudge0;
