import TokenModel from "../../models/token.model";
import { TokenIF, TokenPayloadIF } from "../../types/token.types";
import { ITokenRepository } from "../interfaces/token.repository.interface";

export class TokenRepository implements ITokenRepository {
  async createToken(token: TokenPayloadIF): Promise<void> {
    await TokenModel.create(token);
  }
  async deleteTokenByUserId(userId: string): Promise<void> {
    await TokenModel.deleteOne({ userId });
  }
  async getTokenByUserId(userId: string): Promise<TokenIF | null> {
    return await TokenModel.findOne({ userId });
  }
  async updateTokenByUser(token: TokenPayloadIF): Promise<void> {
    await TokenModel.findOneAndUpdate({ userId:token.userId }, token, { new: true });
  }
}
