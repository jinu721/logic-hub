import { Router } from "express";
import { authMiddleware } from "../shared/middlewares/auth.middleware";
import { LEVEL_ROUTES } from "../shared/constants/ROUTES/level.constants";
import { container } from "../di/types";

const router: Router = Router();

const levelController = container.levelCtrl;

router.use(authMiddleware);

router.post(LEVEL_ROUTES.BASE, levelController.createLevel.bind(levelController));
router.get(LEVEL_ROUTES.BASE, levelController.getAllLevels.bind(levelController));
router.get(LEVEL_ROUTES.BY_ID, levelController.getLevelById.bind(levelController));
router.put(LEVEL_ROUTES.UPDATE, levelController.updateLevel.bind(levelController));
router.delete(LEVEL_ROUTES.DELETE, levelController.deleteLevel.bind(levelController));
router.put(LEVEL_ROUTES.USER_XP, levelController.updateUserLevel.bind(levelController));


export default router;
