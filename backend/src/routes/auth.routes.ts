import { Router } from "express";
import { AuthController } from "../controllers/implements/auth.controller";
import { UserService } from "../services/implements/user.service";
import { UserRepository } from "../repository/implements/user.repository";
import { OTPServices } from "../services/implements/otp.service";
import { OtpRepository } from "../repository/implements/otp.repository";
import passport from "passport";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ChallengeProgressRepository } from "../repository/implements/progress.repository";
import { TokenService } from "../services/implements/token.service";
import { TokenRepository } from "../repository/implements/token.repository";

const router = Router();

const authController = new AuthController(
  new UserService(
    new UserRepository(),
    new OTPServices(new OtpRepository()),
    new ChallengeProgressRepository(),
  ),
  new TokenService(new TokenRepository())
);

router.post("/register", authController.register.bind(authController));
router.post("/verify-otp", authController.verifyOTP.bind(authController));
router.post("/login", authController.login.bind(authController));
router.get("/verify-login", authController.verifyLogin.bind(authController));
router.post("/forgot-password", authController.forgotPassword.bind(authController));
router.post("/reset-password", authController.resetPassword.bind(authController));
router.post("/refresh-token", authController.refreshToken.bind(authController));

router.post("/change-password", authMiddleware, authController.changePassword.bind(authController));
router.get("/me", authMiddleware, authController.getMe.bind(authController));
router.post("/logout", authMiddleware, authController.logout.bind(authController));
router.post("/clear-cookies", authController.clearCookies.bind(authController));

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/register", session: false }),
  authController.googleAuth.bind(authController)
);

router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false }));
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/register", session: false }),
  authController.githubAuth.bind(authController)
);

export default router;
