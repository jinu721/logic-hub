import express from "express";
import { ChallengeController } from "../controllers/implements/challange.controller";
import { ChallengeService } from "../services/implements/challange.service";
import { ChallengeRepository } from "../repository/implements/challange.repository";
import { LevelRepository } from "../repository/implements/level.repository";
import { UserRepository } from "../repository/implements/user.repository";
import { ChallengeProgressRepository } from "../repository/implements/progress.repository";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

const challengeController = new ChallengeController(
  new ChallengeService(
    new ChallengeRepository(),
    new LevelRepository(),
    new UserRepository(),
    new ChallengeProgressRepository()
  )
);

router.use(authMiddleware);

router.get("/admin/all", challengeController.getAllChallenges.bind(challengeController));
router.post("/", challengeController.createChallenge.bind(challengeController));
router.get("/:id", challengeController.getChallengeById.bind(challengeController));
router.get("/", challengeController.getChallenges.bind(challengeController));
router.put("/:id", challengeController.updateChallenge.bind(challengeController));
router.delete("/:id", challengeController.deleteChallenge.bind(challengeController));

router.get("/status/:status", challengeController.getChallengesByStatus.bind(challengeController));
router.post("/tags", challengeController.getChallengesByTags.bind(challengeController));
router.get("/difficulty/:difficulty", challengeController.getChallengesByDifficulty.bind(challengeController));
router.post("/run", challengeController.runChallengeCode.bind(challengeController));
router.post("/submit", challengeController.submitChallenge.bind(challengeController));

export default router;
