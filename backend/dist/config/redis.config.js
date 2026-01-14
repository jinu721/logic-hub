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
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnect = void 0;
const redis_1 = require("redis");
const env_1 = require("./env");
const client = (0, redis_1.createClient)({
    username: env_1.env.REDIS_USERNAME,
    password: env_1.env.REDIS_PASSWORD,
    socket: {
        host: env_1.env.REDIS_HOST || "localhost",
        port: env_1.env.REDIS_PORT || 12993
    }
});
client.on('error', err => console.log('Redis Client Error', err));
const redisConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log("Redis Connected Successfully");
    }
    catch (err) {
        console.log(err);
    }
});
exports.redisConnect = redisConnect;
exports.default = client;
