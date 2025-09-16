import { Router } from "express";
import passport from "passport";
import { authMiddleware } from "../middlewares/auth.middleware";
import { AUTH_ROUTES } from "../constants/ROUTES/auth.constants";
import { container } from "../di/container";

const router = Router();

const authController = container.authCtrl;

router.post(AUTH_ROUTES.REGISTER, authController.register.bind(authController));
router.post(AUTH_ROUTES.VERIFY_OTP, authController.verifyOTP.bind(authController));
router.post(AUTH_ROUTES.LOGIN, authController.login.bind(authController));
router.get(AUTH_ROUTES.VERIFY_LOGIN, authController.verifyLogin.bind(authController));
router.post(AUTH_ROUTES.FORGOT_PASSWORD, authController.forgotPassword.bind(authController));
router.post(AUTH_ROUTES.RESET_PASSWORD, authController.resetPassword.bind(authController));
router.post(AUTH_ROUTES.REFRESH_TOKEN, authController.refreshToken.bind(authController));

router.post(AUTH_ROUTES.CHANGE_PASSWORD, authMiddleware, authController.changePassword.bind(authController));
router.get(AUTH_ROUTES.ME, authMiddleware, authController.getMe.bind(authController));
router.post(AUTH_ROUTES.LOGOUT, authMiddleware, authController.logout.bind(authController));
router.post(AUTH_ROUTES.CLEAR_COOKIES, authController.clearCookies.bind(authController));

router.get(
  AUTH_ROUTES.GOOGLE,
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);
router.get(
  AUTH_ROUTES.GOOGLE_CALLBACK,
  passport.authenticate("google", { failureRedirect: AUTH_ROUTES.REGISTER, session: false }),
  authController.googleAuth.bind(authController)
);

router.get(
  AUTH_ROUTES.GITHUB,
  passport.authenticate("github", { scope: ["user:email"], session: false })
);
router.get(
  AUTH_ROUTES.GITHUB_CALLBACK,
  passport.authenticate("github", { failureRedirect: AUTH_ROUTES.REGISTER, session: false }),
  authController.githubAuth.bind(authController)
);

export default router;
