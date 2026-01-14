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
exports.generateUsername = void 0;
const user_1 = require("../../../modules/user");
const generateUsername = (name) => __awaiter(void 0, void 0, void 0, function* () {
    let username = name.toLowerCase().replace(/[^a-zA-Z0-9._]/g, "");
    if (!username)
        username = "user";
    if (/^\d+$/.test(username))
        username = "user";
    while (username.length < 3) {
        const extraChar = Math.random() < 0.5 ? "." : "_";
        username += extraChar + Math.floor(Math.random() * 10);
    }
    username = username.substring(0, 20);
    let exists = yield user_1.UserModel.findOne({ username });
    while (exists) {
        const randomSuffix = Math.floor(Math.random() * 100);
        const specialChar = Math.random() < 0.5 ? "." : "_";
        username = username.substring(0, 17) + specialChar + randomSuffix;
        exists = yield user_1.UserModel.findOne({ username });
    }
    return username;
});
exports.generateUsername = generateUsername;
