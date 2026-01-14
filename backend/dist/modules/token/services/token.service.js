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
exports.TokenService = void 0;
const _constants_1 = require("../../../shared/constants");
const token_1 = require("../../token");
const application_1 = require("../../../shared/utils/application");
const database_1 = require("../../../shared/utils/database");
const _core_1 = require("../../../shared/core");
class TokenService extends _core_1.BaseService {
    constructor(_tokenRepo, _tokenProv) {
        super();
        this._tokenRepo = _tokenRepo;
        this._tokenProv = _tokenProv;
    }
    toDTO(entity) {
        return (0, token_1.toPublicTokenDto)(entity);
    }
    toDTOs(entities) {
        return (0, token_1.toPublicTokenDtos)(entities);
    }
    createToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAlreadyExist = yield this._tokenRepo.getTokenByUserId(token.userId);
            if (!isAlreadyExist) {
                yield this._tokenRepo.createToken(token);
            }
            else {
                yield this._tokenRepo.updateTokenByUser(token);
            }
        });
    }
    deleteTokenByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._tokenRepo.deleteTokenByUserId(userId);
        });
    }
    getTokenByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this._tokenRepo.getTokenByUserId(userId);
            if (!token) {
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Token not found");
            }
            return this.mapOne(token);
        });
    }
    revokeActiveAccessTokens(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield this._tokenRepo.getTokenByUserId(userId);
            if (!tokenData || !tokenData.accessToken) {
                return false;
            }
            const token = tokenData.accessToken;
            const decoded = this._tokenProv.decodeToken(token);
            if (!decoded || !decoded.exp) {
                return false;
            }
            const expiry = decoded.exp - Math.floor(Date.now() / 1000);
            yield database_1.RedisHelper.set(`blacklist_${token}`, "true", expiry);
            yield this._tokenRepo.deleteTokenByUserId(userId);
            return true;
        });
    }
}
exports.TokenService = TokenService;
