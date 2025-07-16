import { IChallengeController } from "../interfaces/challange.controller.interface";
import { Request, Response } from "express";
import { HttpStatus } from "../../constants/http.status";
import { ChallengeService } from "../../services/implements/challange.service";
import { Types } from "mongoose";

interface RunCodeRequest {
  challengeId: string;
  language: string;
  sourceCode: string;
  input: string;
  userId: string;
}


export class ChallengeController implements IChallengeController {
  private challengeService: ChallengeService;

  constructor(challengeService: ChallengeService) {
    this.challengeService = challengeService;
  }

  async createChallenge(req: Request, res: Response): Promise<void> {
    try {
      const challenge = await this.challengeService.createChallenge(req.body);
      res.status(HttpStatus.CREATED).json(challenge);
    } catch (err:any) {
      console.log(err)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to create challenge" });
    }
  }

  async getChallengeById(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const challengeId = req.params.id;
      const challenge = await this.challengeService.getChallengeById(challengeId,userId);
      res.status(HttpStatus.OK).json(challenge);
    } catch (err:any) {
      console.log(err)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch challenge" });
    }
  }

  async getChallenges(req: Request, res: Response): Promise<void> { 
    try {
      const userId = (req as any).user?.userId;

      console.log(`Req Query Params : ${JSON.stringify(req.query)}`);

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const result = await this.challengeService.getChallenges(req.query,userId);
      res.status(HttpStatus.OK).json(result);
    } catch (err:any) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch challenges" });
    }
  }

  async getAllChallenges(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search;
      const page = req.query.page;
      const limit = req.query.limit;
      const challenges = await this.challengeService.getAllChallenges(search as string,Number(page),Number(limit));
      res.status(HttpStatus.OK).json(challenges);
    } catch (err:any) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch all challenges" });
    }
  }

  async updateChallenge(req: Request, res: Response): Promise<void> {
    try {
      const challengeId = req.params.id;
      const updateData = req.body;
      const updatedChallenge = await this.challengeService.updateChallenge(new Types.ObjectId(challengeId), updateData);
      res.status(HttpStatus.OK).json(updatedChallenge);
    } catch (err:any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to update challenge" });
    }
  }

  async deleteChallenge(req: Request, res: Response): Promise<void> {
    try {
      const challengeId = req.params.id;
      const challengeObjectId = new Types.ObjectId(challengeId);
      await this.challengeService.deleteChallenge(challengeObjectId);
      res.status(HttpStatus.OK).json({ message: "Challenge deleted successfully" });
    } catch (err:any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete challenge" });
    }
  }

  async getChallengesByStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = req.params.status;
      const challenges = await this.challengeService.getChallengesByStatus(status as "active" | "inactive" | "draft" | "archived");
      res.status(HttpStatus.OK).json(challenges);
    } catch (err:any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch challenges by status" });
    }
  }

  async getChallengesByTags(req: Request, res: Response): Promise<void> {
    try {
      const tags = req.body.tags;
      const challenges = await this.challengeService.getChallengesByTags(tags);
      res.status(HttpStatus.OK).json(challenges);
    } catch (err:any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch challenges by tags" });
    }
  }

  async getChallengesByDifficulty(req: Request, res: Response): Promise<void> {
    try {
      const difficulty = req.params.difficulty;
      const challenges = await this.challengeService.getChallengesByDifficulty(difficulty as "novice" | "adept" | "master");
      res.status(HttpStatus.OK).json(challenges);
    } catch (err:any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch challenges by difficulty" });
    }
  }

  async runChallengeCode (req: Request, res: Response):Promise<void> {
    const { challengeId, language, sourceCode, input,userId}: RunCodeRequest = req.body;
    try {
      const result = await this.challengeService.runChallengeCode(challengeId,language,sourceCode,input,userId);
      res.status(HttpStatus.OK).json(result);
    } catch (err:any) {
      console.log(err)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  };
  
  async submitChallenge(req: Request, res: Response):Promise<void>{
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const result = await this.challengeService.submitChallange(req.body,userId);
      res.status(HttpStatus.OK).json(result);
    } catch (err:any) {
      console.log(err)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  };

}
