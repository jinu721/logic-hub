import { TokenIF, TokenPayloadIF } from "../../types/token.types";

export interface ITokenRepository {
    createToken: (token: TokenPayloadIF) => Promise<TokenIF>;
    deleteTokenByUserId: (userId:string) => Promise<boolean>;
    getTokenByUserId: (userId: string) => Promise<TokenIF | null>;
    updateTokenByUser: (token:TokenPayloadIF) => Promise<TokenIF | null>;
}