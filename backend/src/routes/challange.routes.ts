import express from "express";
import { authMiddleware } from "../shared/middlewares/auth.middleware";
import { CHALLENGE_ROUTES } from "../shared/constants/ROUTES/challenge.constants";
import { container } from "../di/types";

const router = express.Router();

const challengeController = container.challengeCtrl;

router.use(authMiddleware);

router.get(CHALLENGE_ROUTES.BASE, challengeController.getAllChallenges.bind(challengeController));
router.post(CHALLENGE_ROUTES.CREATE, challengeController.createChallenge.bind(challengeController));
router.get(CHALLENGE_ROUTES.BY_ID, challengeController.getChallengeById.bind(challengeController));
router.get(CHALLENGE_ROUTES.GET_ALL, challengeController.getChallenges.bind(challengeController));
router.put(CHALLENGE_ROUTES.UPDATE, challengeController.updateChallenge.bind(challengeController));
router.delete(CHALLENGE_ROUTES.DELETE, challengeController.deleteChallenge.bind(challengeController));

router.get(CHALLENGE_ROUTES.BY_STATUS, challengeController.getChallengesByStatus.bind(challengeController));
router.post(CHALLENGE_ROUTES.BY_TAGS, challengeController.getChallengesByTags.bind(challengeController));
router.get(CHALLENGE_ROUTES.BY_DIFFICULTY, challengeController.getChallengesByDifficulty.bind(challengeController));
router.post(CHALLENGE_ROUTES.RUN_CODE, challengeController.runChallengeCode.bind(challengeController));
router.post(CHALLENGE_ROUTES.SUBMIT, challengeController.submitChallenge.bind(challengeController));

export default router;
