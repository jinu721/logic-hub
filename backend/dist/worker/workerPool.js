"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const piscina_1 = __importDefault(require("piscina"));
const path_1 = __importDefault(require("path"));
const piscina = new piscina_1.default({
    filename: path_1.default.resolve(__dirname, "./piston.worker.js"),
    execArgv: ['-r', 'ts-node/register'],
    minThreads: 2,
    maxThreads: 8,
});
exports.default = piscina;
