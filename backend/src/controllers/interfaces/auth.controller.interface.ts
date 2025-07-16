import { Request, Response } from "express";

export interface IAuthController {
  register(req: Request, res: Response): Promise<void>;
  verifyOTP(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  verifyLogin(req: Request, res: Response): Promise<void>;
  refreshToken(req: Request, res: Response): void;
  googleAuth(req: Request, res: Response): Promise<void>;
  githubAuth(req: Request, res: Response): Promise<void>;
  forgotPassword(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
  getMe(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  clearCookies(req: Request, res: Response): void;
}
