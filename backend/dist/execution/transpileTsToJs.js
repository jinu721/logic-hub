"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transpileTsToJs = transpileTsToJs;
const typescript_1 = __importDefault(require("typescript"));
function transpileTsToJs(code) {
    const output = typescript_1.default.transpileModule(code, {
        compilerOptions: { module: typescript_1.default.ModuleKind.None }
    });
    return output.outputText;
}
