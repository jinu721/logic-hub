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
exports.bootstrap = void 0;
const _di_1 = require("./di");
const app_1 = require("./app");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const setup_socket_1 = require("./socket/setup.socket");
const env_1 = require("./config/env");
const bootstrap = () => __awaiter(void 0, void 0, void 0, function* () {
    const container = (0, _di_1.createContainer)();
    const app = (0, app_1.createApp)(container);
    const httpServer = (0, http_1.createServer)(app);
    const io = new socket_io_1.Server(httpServer, {
        cors: { origin: env_1.env.FRONTEND_URL, credentials: true },
    });
    (0, setup_socket_1.setupSocket)(io, container);
    httpServer.listen(env_1.env.PORT, () => {
        console.log(`Server started on port ${env_1.env.PORT}`);
    });
});
exports.bootstrap = bootstrap;
