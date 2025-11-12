import express from "express";
import { authMiddleware } from "@middlewares";
import { CHALLENGE_ROUTES } from "@constants";
import { Container } from "@di";


export const challengeRoutes = (container: Container) => {
    const router = express.Router();

    const challengeController = container.challengeCtrl;
    
    router.use(authMiddleware);
    
    router.get(CHALLENGE_ROUTES.BASE, challengeController.getUserHomeChallenges.bind(challengeController));
    router.post(CHALLENGE_ROUTES.CREATE, challengeController.createChallenge.bind(challengeController));
    router.get(CHALLENGE_ROUTES.BY_ID, challengeController.getChallengeById.bind(challengeController));
    router.get(CHALLENGE_ROUTES.GET_ALL, challengeController.getAllChallenges.bind(challengeController));
    router.put(CHALLENGE_ROUTES.UPDATE, challengeController.updateChallenge.bind(challengeController));
    router.delete(CHALLENGE_ROUTES.DELETE, challengeController.deleteChallenge.bind(challengeController));
    
    router.post(CHALLENGE_ROUTES.RUN_CODE, challengeController.runChallengeCode.bind(challengeController));
    router.post(CHALLENGE_ROUTES.SUBMIT, challengeController.submitChallenge.bind(challengeController));
    
    return router;
}

