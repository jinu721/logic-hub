import { HttpStatus } from "@constants"
import {
  PublicTokenDTO,
  toPublicTokenDto,
  toPublicTokenDtos,
  ITokenRepository,
  ITokenService
} from "@modules/token"
import { TokenIF, TokenPayloadIF } from "@shared/types"
import { AppError } from "@utils/application"
import { RedisHelper } from "@utils/database"
import { ITokenProvider } from "@providers/token"
import { BaseService } from "@core"


export class TokenService
  extends BaseService<TokenIF, PublicTokenDTO>
  implements ITokenService
{
  constructor(private readonly _tokenRepo: ITokenRepository, private readonly _tokenProv: ITokenProvider) {
    super();
  }

  protected toDTO(entity: TokenIF): PublicTokenDTO {
    return toPublicTokenDto(entity);
  }

  protected toDTOs(entities: TokenIF[]): PublicTokenDTO[] {
    return toPublicTokenDtos(entities);
  }

  async createToken(token: TokenPayloadIF): Promise<void> {
    const isAlreadyExist = await this._tokenRepo.getTokenByUserId(token.userId);
    if (!isAlreadyExist) {
      await this._tokenRepo.createToken(token);
    } else {
      await this._tokenRepo.updateTokenByUser(token);
    }
  }

  async deleteTokenByUserId(userId: string): Promise<void> {
    await this._tokenRepo.deleteTokenByUserId(userId);
  }
  async getTokenByUserId(userId: string): Promise<PublicTokenDTO | null> {
    const token = await this._tokenRepo.getTokenByUserId(userId);
    if (!token) {
      throw new AppError(HttpStatus.NOT_FOUND, "Token not found");
    }
    return this.mapOne(token);
  }
  async revokeActiveAccessTokens(userId: string): Promise<boolean> {
    const tokenData = await this._tokenRepo.getTokenByUserId(userId);

    if (!tokenData || !tokenData.accessToken) {
      return false; 
    }

    const token = tokenData.accessToken;

    const decoded = this._tokenProv.decodeToken(token);

    if (!decoded || !decoded.exp) {
      return false;
    }

    const expiry = (decoded.exp as number) - Math.floor(Date.now() / 1000);

    await RedisHelper.set(`blacklist_${token}`, "true", expiry);

    await this._tokenRepo.deleteTokenByUserId(userId);

    return true;
  }
}
