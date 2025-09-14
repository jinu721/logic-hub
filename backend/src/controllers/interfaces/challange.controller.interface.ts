import { Request, Response } from "express";
import { IChallengeService } from "../../services/interfaces/challange.service.interface"; 

export interface IChallengeController {
  createChallenge(req: Request, res: Response): Promise<void>;
  getChallengeById(req: Request, res: Response): Promise<void>;
  getChallenges(req: Request, res: Response): Promise<void>;
  getAllChallenges(req: Request, res: Response): Promise<void>;
  updateChallenge(req: Request, res: Response): Promise<void>;
  deleteChallenge(req: Request, res: Response): Promise<void>;
  getChallengesByStatus(req: Request, res: Response): Promise<void>;
  getChallengesByTags(req: Request, res: Response): Promise<void>;
  getChallengesByDifficulty(req: Request, res: Response): Promise<void>;
  runChallengeCode(req: Request, res: Response): Promise<void>;
  submitChallenge(req: Request, res: Response): Promise<void>;
}
