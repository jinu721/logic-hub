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
exports.TokenRepository = void 0;
const token_1 = require("../../token");
const _core_1 = require("../../../shared/core");
const database_1 = require("../../../shared/utils/database");
class TokenRepository extends _core_1.BaseRepository {
    constructor() {
        super(token_1.TokenModel);
    }
    createToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const newToken = new this.model(token);
            const saved = yield newToken.save();
            return saved.toObject();
        });
    }
    deleteTokenByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.deleteOne({ userId });
            return !!result;
        });
    }
    getTokenByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.toLean)(this.model.findOne({ userId }));
        });
    }
    updateTokenByUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.toLean)(this.model.findOneAndUpdate({ userId: token.userId }, token, { new: true }));
        });
    }
}
exports.TokenRepository = TokenRepository;
