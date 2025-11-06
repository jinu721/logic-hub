import { Router } from "express";
import { authMiddleware } from "../shared/middlewares/auth.middleware";
import { SOLUTION_ROUTES } from "../shared/constants/ROUTES/solution.constants";
import { container } from "../di/types";

const router = Router();

const solutionController = container.solutionCtrl;

router.use(authMiddleware);

router.post(SOLUTION_ROUTES.BASE, solutionController.create.bind(solutionController));
router.get(SOLUTION_ROUTES.BY_CHALLENGE, solutionController.getByChallenge.bind(solutionController));
router.get(SOLUTION_ROUTES.BY_USER, solutionController.getByUser.bind(solutionController));
router.post(SOLUTION_ROUTES.LIKE, solutionController.like.bind(solutionController));
router.post(SOLUTION_ROUTES.COMMENT, solutionController.comment.bind(solutionController));
router.delete(SOLUTION_ROUTES.DELETE_COMMENT, solutionController.deleteComment.bind(solutionController));
router.put(SOLUTION_ROUTES.UPDATE, solutionController.update.bind(solutionController));
router.delete(SOLUTION_ROUTES.DELETE, solutionController.delete.bind(solutionController));


export default router;
