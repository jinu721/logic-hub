import { Router } from "express";
import { LevelController } from "../controllers/implements/level.controller";
import { LevelService } from "../services/implements/level.service";
import { LevelRepository } from "../repository/implements/level.repository";
import { UserRepository } from "../repository/implements/user.repository";
import { authMiddleware } from "../middlewares/auth.middleware";

const router: Router = Router();

const levelController = new LevelController(
  new LevelService(new LevelRepository(), new UserRepository())
);

router.use(authMiddleware);

router.post("/", levelController.createLevel.bind(levelController));
router.get("/", levelController.getAllLevels.bind(levelController));
router.get("/:id", levelController.getLevelById.bind(levelController));
router.put("/:id", levelController.updateLevel.bind(levelController));
router.delete("/:id", levelController.deleteLevel.bind(levelController));
router.put("/user/:userId/xp", levelController.updateUserLevel.bind(levelController));

export default router;
