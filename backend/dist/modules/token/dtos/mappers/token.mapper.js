"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicTokenDtos = exports.toPublicTokenDto = void 0;
const toPublicTokenDto = (token) => ({
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
});
exports.toPublicTokenDto = toPublicTokenDto;
const toPublicTokenDtos = (tokens) => tokens.map(exports.toPublicTokenDto);
exports.toPublicTokenDtos = toPublicTokenDtos;
