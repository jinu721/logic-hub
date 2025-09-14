import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { PROGRESS_ROUTES } from "../constants/ROUTES/proggress.constants";
import { container } from "../di/container";

const router = Router();

const challengeProgressController = container.progressCtrl;

router.use(authMiddleware);

router.post(PROGRESS_ROUTES.BASE, challengeProgressController.createProgress.bind(challengeProgressController));
router.get(PROGRESS_ROUTES.BASE, challengeProgressController.getAllProgress.bind(challengeProgressController));
router.get(PROGRESS_ROUTES.BY_ID, challengeProgressController.getProgressById.bind(challengeProgressController));
router.put(PROGRESS_ROUTES.UPDATE, challengeProgressController.updateProgress.bind(challengeProgressController));
router.delete(PROGRESS_ROUTES.DELETE, challengeProgressController.deleteProgress.bind(challengeProgressController));
router.get(PROGRESS_ROUTES.BY_USER, challengeProgressController.getAllProgressByUser.bind(challengeProgressController));
router.get(PROGRESS_ROUTES.RECENT_BY_USER, challengeProgressController.getRecentProgress.bind(challengeProgressController));
router.get(PROGRESS_ROUTES.BY_CHALLENGE, challengeProgressController.getAllProgressByChallenge.bind(challengeProgressController));
router.get(PROGRESS_ROUTES.HEATMAP, challengeProgressController.getHeatmap.bind(challengeProgressController));
router.get(PROGRESS_ROUTES.BY_USER_AND_CHALLENGE, challengeProgressController.getProgressByUserAndChallenge.bind(challengeProgressController));

export default router;
