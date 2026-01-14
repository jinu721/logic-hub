"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.membershipRoutes = void 0;
const express_1 = __importDefault(require("express"));
const _middlewares_1 = require("../../../shared/middlewares");
const _constants_1 = require("../../../shared/constants");
const membershipRoutes = (container) => {
    const router = express_1.default.Router();
    const membershipController = container.membershipCtrl;
    router.use(_middlewares_1.authMiddleware);
    router.post(_constants_1.MEMBERSHIP_ROUTES.BASE, membershipController.createMembership.bind(membershipController));
    router.get(_constants_1.MEMBERSHIP_ROUTES.GET_ALL, membershipController.getAllMemberships.bind(membershipController));
    router.get(_constants_1.MEMBERSHIP_ROUTES.ACTIVE, membershipController.getTwoActiveMemberships.bind(membershipController));
    router.get(_constants_1.MEMBERSHIP_ROUTES.BY_ID, membershipController.getMembershipById.bind(membershipController));
    router.put(_constants_1.MEMBERSHIP_ROUTES.UPDATE, membershipController.updateMembership.bind(membershipController));
    router.delete(_constants_1.MEMBERSHIP_ROUTES.DELETE, membershipController.deleteMembership.bind(membershipController));
    return router;
};
exports.membershipRoutes = membershipRoutes;
