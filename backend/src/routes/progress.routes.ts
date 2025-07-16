import { Router } from "express";
import { ChallengeProgressService } from "../services/implements/progress.service";
import { ChallengeProgressController } from "../controllers/implements/progress.controller";
import { ChallengeProgressRepository } from "../repository/implements/progress.repository";
import { UserRepository } from "../repository/implements/user.repository";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

const challengeProgressController = new ChallengeProgressController(
  new ChallengeProgressService(
    new ChallengeProgressRepository(),
    new UserRepository()
  )
);

router.use(authMiddleware);

router.post("/", challengeProgressController.createProgress.bind(challengeProgressController));
router.get("/", challengeProgressController.getAllProgress.bind(challengeProgressController));
router.get("/:id", challengeProgressController.getProgressById.bind(challengeProgressController));
router.put("/:id", challengeProgressController.updateProgress.bind(challengeProgressController));
router.delete("/:id", challengeProgressController.deleteProgress.bind(challengeProgressController));
router.get("/user/:username", challengeProgressController.getAllProgressByUser.bind(challengeProgressController));
router.get("/recent/user/:input", challengeProgressController.getRecentProgress.bind(challengeProgressController));
router.get("/challenge/:challengeId", challengeProgressController.getAllProgressByChallenge.bind(challengeProgressController));
router.get("/user/heatmap/:username", challengeProgressController.getHeatmap.bind(challengeProgressController));
router.get("/user/:userId/challenge/:challengeId", challengeProgressController.getProgressByUserAndChallenge.bind(challengeProgressController));

export default router;
