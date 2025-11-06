import { TokenModel, ITokenRepository } from "@modules/token"
import { TokenIF, TokenPayloadIF } from "@shared/types"
import { BaseRepository } from "@core"
import { toLean } from "@utils/database"


export class TokenRepository
  extends BaseRepository<TokenIF>
  implements ITokenRepository
{
  constructor() {
    super(TokenModel);
  }

  async createToken(token: TokenPayloadIF): Promise<TokenIF> {
    const newToken = new this.model(token);
    const saved = await newToken.save();
    return saved.toObject() as TokenIF;
  }

  async deleteTokenByUserId(userId: string): Promise<boolean> {
    const result = await this.deleteOne({ userId });
    return !!result;
  }

  async getTokenByUserId(userId: string): Promise<TokenIF | null> {
    return toLean<TokenIF>(this.model.findOne({ userId }));
  }

  async updateTokenByUser(token: TokenPayloadIF): Promise<TokenIF | null> {
    return toLean<TokenIF>(
      this.model.findOneAndUpdate({ userId: token.userId }, token, { new: true })
    );
  }
}
