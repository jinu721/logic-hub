import { TokenIF } from "../shared/types/token.types";

export interface PublicTokenDTO {
    accessToken: string;
    refreshToken: string;
}


export const toPublicTokenDto = (token: TokenIF): PublicTokenDTO => ({
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
});

export const toPublicTokenDtos = (tokens: TokenIF[]): PublicTokenDTO[] => tokens.map(toPublicTokenDto);