import { TokenIF } from "@shared/types";
import { PublicTokenDTO } from "@modules/token";


export const toPublicTokenDto = (token: TokenIF): PublicTokenDTO => ({
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
});

export const toPublicTokenDtos = (tokens: TokenIF[]): PublicTokenDTO[] => tokens.map(toPublicTokenDto);