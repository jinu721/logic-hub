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
exports.runInWorkerThread = void 0;
const workerPool_1 = __importDefault(require("./workerPool"));
const runInWorkerThread = (language_1, files_1, ...args_1) => __awaiter(void 0, [language_1, files_1, ...args_1], void 0, function* (language, files, options = {}) {
    return yield workerPool_1.default.run({ language, files, options });
});
exports.runInWorkerThread = runInWorkerThread;
