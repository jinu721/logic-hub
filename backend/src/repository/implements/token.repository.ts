import TokenModel from "../../models/token.model";
import { TokenIF, TokenPayloadIF } from "../../types/token.types";
import { BaseRepository } from "../base.repository";
import { ITokenRepository } from "../interfaces/token.repository.interface";
import { toLean } from "../../utils/database/query.utils";

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
