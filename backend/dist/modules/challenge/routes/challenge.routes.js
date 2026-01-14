"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.challengeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const _middlewares_1 = require("../../../shared/middlewares");
const _constants_1 = require("../../../shared/constants");
const challengeRoutes = (container) => {
    const router = express_1.default.Router();
    const challengeController = container.challengeCtrl;
    router.use(_middlewares_1.authMiddleware);
    router.get(_constants_1.CHALLENGE_ROUTES.BASE, challengeController.getUserHomeChallenges.bind(challengeController));
    router.post(_constants_1.CHALLENGE_ROUTES.CREATE, challengeController.createChallenge.bind(challengeController));
    router.get(_constants_1.CHALLENGE_ROUTES.GET_ALL, challengeController.getAllChallenges.bind(challengeController));
    router.get(_constants_1.CHALLENGE_ROUTES.BY_ID, challengeController.getChallengeById.bind(challengeController));
    router.put(_constants_1.CHALLENGE_ROUTES.UPDATE, challengeController.updateChallenge.bind(challengeController));
    router.delete(_constants_1.CHALLENGE_ROUTES.DELETE, challengeController.deleteChallenge.bind(challengeController));
    router.post(_constants_1.CHALLENGE_ROUTES.RUN_CODE, challengeController.runChallengeCode.bind(challengeController));
    router.post(_constants_1.CHALLENGE_ROUTES.SUBMIT, challengeController.submitChallenge.bind(challengeController));
    return router;
};
exports.challengeRoutes = challengeRoutes;
