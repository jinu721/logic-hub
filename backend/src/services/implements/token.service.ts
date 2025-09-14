import { PublicTokenDTO, toPublicTokenDto } from "../../mappers/token.dto";
import { ITokenRepository } from "../../repository/interfaces/token.repository.interface";
import { TokenIF, TokenPayloadIF } from "../../types/token.types";
import { ITokenService } from "../interfaces/token.service.interface";

export class TokenService implements ITokenService {
    constructor(private readonly tokenRepo: ITokenRepository) {}

    async createToken(token: TokenPayloadIF): Promise<void> {
        const isAlreadyExist = await this.tokenRepo.getTokenByUserId(token.userId)
        if(!isAlreadyExist){
            await this.tokenRepo.createToken(token);
        }else{
            await this.tokenRepo.updateTokenByUser(token);
        }
    }

    async deleteTokenByUserId(userId: string): Promise<void> {
        await this.tokenRepo.deleteTokenByUserId(userId);
    }
    async getTokenByUserId(userId: string): Promise<PublicTokenDTO | null> {
        const token = await this.tokenRepo.getTokenByUserId(userId);
        return toPublicTokenDto(token as TokenIF);
    }
}