import { HttpStatus } from "../../constants/http.status";
import { PublicTokenDTO, toPublicTokenDto, toPublicTokenDtos } from "../../mappers/token.dto";
import { ITokenRepository } from "../../repository/interfaces/token.repository.interface";
import { TokenIF, TokenPayloadIF } from "../../types/token.types";
import { AppError } from "../../utils/application/app.error";
import { BaseService } from "../base.service";
import { ITokenService } from "../interfaces/token.service.interface";

export class TokenService extends BaseService<TokenIF, PublicTokenDTO> implements ITokenService {
    constructor(private readonly _tokenRepo: ITokenRepository) {
        super();
    }

    protected toDTO(entity: TokenIF): PublicTokenDTO {
        return toPublicTokenDto(entity);
    }

    protected toDTOs(entities: TokenIF[]): PublicTokenDTO[] {
        return toPublicTokenDtos(entities);
    }

    async createToken(token: TokenPayloadIF): Promise<void> {
        const isAlreadyExist = await this._tokenRepo.getTokenByUserId(token.userId)
        if(!isAlreadyExist){
            await this._tokenRepo.createToken(token);
        }else{
            await this._tokenRepo.updateTokenByUser(token);
        }
    }

    async deleteTokenByUserId(userId: string): Promise<void> {
        await this._tokenRepo.deleteTokenByUserId(userId);
    }
    async getTokenByUserId(userId: string): Promise<PublicTokenDTO | null> {
        const token = await this._tokenRepo.getTokenByUserId(userId);
        if(!token){
            throw new AppError(HttpStatus.NOT_FOUND,"Token not found");
        }
        return this.mapOne(token);
    }
}