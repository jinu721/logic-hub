import { Request, Response } from "express";

export interface IAuthController {
  register(req: Request, res: Response): Promise<Response>;
  verifyOTP(req: Request, res: Response): Promise<Response>;
  login(req: Request, res: Response): Promise<Response>;
  verifyLogin(req: Request, res: Response): Promise<Response>;
  changePassword(req: Request, res: Response): Promise<Response>;
  googleAuth(req: Request, res: Response): Promise<void>;
  githubAuth(req: Request, res: Response): Promise<void>;
  forgotPassword(req: Request, res: Response): Promise<Response>;
  resetPassword(req: Request, res: Response): Promise<Response>;
  getMe(req: Request, res: Response): Promise<Response>;
  logout(req: Request, res: Response): Promise<Response>;
  refreshToken(req: Request, res: Response): Response;
  clearCookies(req: Request, res: Response): Response;
}
