import { Router } from "express";
import { authMiddleware } from "@middlewares";
import { SOLUTION_ROUTES } from "@constants";
import { Container } from "@di";

export const solutionRoutes = (container: Container) => {
    const router = Router();
    
    const solutionController = container.solutionCtrl;
    
    router.use(authMiddleware);
    
    router.post(SOLUTION_ROUTES.BASE, solutionController.createSolution.bind(solutionController));
    router.get(SOLUTION_ROUTES.BY_CHALLENGE, solutionController.getSolutionsByChallenge.bind(solutionController));
    router.get(SOLUTION_ROUTES.BY_USER, solutionController.getSolutionsByUser.bind(solutionController));
    router.post(SOLUTION_ROUTES.LIKE, solutionController.likeSolution.bind(solutionController));
    router.post(SOLUTION_ROUTES.COMMENT, solutionController.commentSolution.bind(solutionController));
    router.delete(SOLUTION_ROUTES.DELETE_COMMENT, solutionController.deleteComment.bind(solutionController));
    router.put(SOLUTION_ROUTES.UPDATE, solutionController.updateSolution.bind(solutionController));
    router.delete(SOLUTION_ROUTES.DELETE, solutionController.deleteSolution.bind(solutionController));


    return router;
}

