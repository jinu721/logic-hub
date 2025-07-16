import express from "express";
import { MembershipController } from "../controllers/implements/membership.controller";
import { MembershipService } from "../services/implements/membership.service";
import { MembershipRepository } from "../repository/implements/membership.repository";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

const membershipController = new MembershipController(
  new MembershipService(new MembershipRepository())
);

router.use(authMiddleware);

router.post("/", membershipController.createMembership.bind(membershipController));
router.get("/", membershipController.getAllMemberships.bind(membershipController));
router.get("/active", membershipController.getTwoActiveMemberships.bind(membershipController));
router.get("/:id", membershipController.getMembershipById.bind(membershipController));
router.put("/:id", membershipController.updateMembership.bind(membershipController));
router.delete("/:id", membershipController.deleteMembership.bind(membershipController));

export default router;
