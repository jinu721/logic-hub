import { Router } from "express";
import { SolutionController } from "../controllers/implements/solution.controller";
import { SolutionService } from "../services/implements/solution.service";
import { SolutionRepository } from "../repository/implements/solution.repository";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

const solutionController = new SolutionController(
  new SolutionService(new SolutionRepository())
);

router.use(authMiddleware);

router.post("/", solutionController.create.bind(solutionController));
router.get("/challenge/:challengeId", solutionController.getByChallenge.bind(solutionController));
router.get("/user/:userId", solutionController.getByUser.bind(solutionController));
router.post("/:solutionId/like", solutionController.like.bind(solutionController));
router.post("/:solutionId/comment", solutionController.comment.bind(solutionController));
router.delete("/:solutionId/comment/:commentId", solutionController.deleteComment.bind(solutionController));
router.put("/:solutionId", solutionController.update.bind(solutionController));
router.delete("/:solutionId", solutionController.delete.bind(solutionController));

export default router;
