import express from "express";
import { UserController } from "../controllers/implements/user.controller";
import { UserService } from "../services/implements/user.service";
import { UserRepository } from "../repository/implements/user.repository";
import { OtpRepository } from "../repository/implements/otp.repository";
import { OTPServices } from "../services/implements/otp.service";
import { ChallengeProgressRepository } from "../repository/implements/progress.repository";
import { authMiddleware } from "../middlewares/auth.middleware"; 
import { TokenRepository } from "../repository/implements/token.repository";
import { TokenService } from "../services/implements/token.service";
const router = express.Router();

const userController = new UserController(
  new UserService(
    new UserRepository(),
    new OTPServices(new OtpRepository()),
    new ChallengeProgressRepository(),
  ),
  new TokenService(new TokenRepository())
);

router.post("/check-user", userController.findUser.bind(userController));
router.post("/resend-otp", userController.resendOtp.bind(userController));
router.post("/verify-admin",  userController.verifyAdmin.bind(userController));

router.get("/", authMiddleware, userController.getUsers.bind(userController));
router.get("/me", authMiddleware, userController.getCurrentUser.bind(userController));
router.put("/me", authMiddleware, userController.updateCurrentUser.bind(userController));
router.get("/:username", authMiddleware, userController.getUser.bind(userController));
router.patch("/:userId/ban", authMiddleware, userController.toggleBan.bind(userController));
router.post("/:userId/gift/:type", authMiddleware, userController.giftItem.bind(userController));
router.post("/membership/cancel", authMiddleware, userController.cancelMembership.bind(userController));
router.post("/daily-reward/claim", authMiddleware, userController.claimDailyReward.bind(userController));

export default router;
