import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { MEMBERSHIP_ROUTES } from "../constants/ROUTES/membership.constants";
import { container } from "../di/container";

const router = express.Router();

const membershipController = container.membershipCtrl;

router.use(authMiddleware);

router.post(MEMBERSHIP_ROUTES.BASE, membershipController.createMembership.bind(membershipController));
router.get(MEMBERSHIP_ROUTES.GET_ALL, membershipController.getAllMemberships.bind(membershipController));
router.get(MEMBERSHIP_ROUTES.ACTIVE, membershipController.getTwoActiveMemberships.bind(membershipController));
router.get(MEMBERSHIP_ROUTES.BY_ID, membershipController.getMembershipById.bind(membershipController));
router.put(MEMBERSHIP_ROUTES.UPDATE, membershipController.updateMembership.bind(membershipController));
router.delete(MEMBERSHIP_ROUTES.DELETE, membershipController.deleteMembership.bind(membershipController));


export default router;
