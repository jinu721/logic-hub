export interface ITokenProvider {
  generateAccessToken(payload: any): string;
  generateRefreshToken(payload: any): string;
  generateLinkToken(payload: any): string;
  generateResetToken(payload: any): string;
  verifyLinkToken(token: string): any;
  verifyAccessToken(token: string): any;
  verifyRefreshToken(token: string): any;
  decodeToken(token: string): any;
}