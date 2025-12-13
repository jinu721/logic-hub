export interface JwtPayloadBase {
  userId: string;
  username: string;
  email: string;
  role: string;
  [key: string]: unknown;
}
