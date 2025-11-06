import { PublicTokenDTO } from "@modules/token";
import { TokenPayloadIF } from "@shared/types";

export interface ITokenService {
    createToken: (token: TokenPayloadIF) => Promise<void>;
    deleteTokenByUserId: (userId: string) => Promise<void>;
    getTokenByUserId: (userId: string) => Promise<PublicTokenDTO | null>;
    revokeActiveAccessTokens: (userId: string) => Promise<boolean>;
}