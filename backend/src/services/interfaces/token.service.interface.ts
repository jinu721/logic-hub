import { PublicTokenDTO } from "../../mappers/token.dto";
import { TokenIF, TokenPayloadIF } from "../../types/token.types";

export interface ITokenService {
    createToken: (token: TokenPayloadIF) => Promise<void>;
    deleteTokenByUserId: (userId: string) => Promise<void>;
    getTokenByUserId: (userId: string) => Promise<PublicTokenDTO | null>;
}