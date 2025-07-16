import { TokenIF, TokenPayloadIF } from "../../types/token.types";

export interface ITokenRepository {
    createToken: (token: TokenPayloadIF) => Promise<void>;
    deleteTokenByUserId: (userId:string) => Promise<void>;
    getTokenByUserId: (userId: string) => Promise<TokenIF | null>;
    updateTokenByUser: (token:TokenPayloadIF) => Promise<void>
}