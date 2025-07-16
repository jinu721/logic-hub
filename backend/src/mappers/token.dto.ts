import { TokenIF } from "../types/token.types";

export interface PublicTokenDTO {
    accessToken: string;
    refreshToken: string;
}


export const toPublicTokenDto = (token: TokenIF): PublicTokenDTO => ({
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
});