"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupRoutes = void 0;
const express_1 = __importDefault(require("express"));
const application_1 = require("../../../shared/utils/application");
const _middlewares_1 = require("../../../shared/middlewares");
const _constants_1 = require("../../../shared/constants");
const groupRoutes = (container) => {
    const router = express_1.default.Router();
    const groupController = container.groupCtrl;
    router.use(_middlewares_1.authMiddleware);
    router.post(_constants_1.GROUP_ROUTES.BASE, application_1.upload.single("groupImage"), groupController.createGroup.bind(groupController));
    router.get(_constants_1.GROUP_ROUTES.BY_USER, groupController.findByUser.bind(groupController));
    router.put(_constants_1.GROUP_ROUTES.UPDATE, groupController.updateGroup.bind(groupController));
    router.delete(_constants_1.GROUP_ROUTES.DELETE, groupController.deleteGroup.bind(groupController));
    router.get(_constants_1.GROUP_ROUTES.GET_ALL, groupController.getAllGroups.bind(groupController));
    router.post(_constants_1.GROUP_ROUTES.JOIN_REQUEST, groupController.sendJoinRequest.bind(groupController));
    router.post(_constants_1.GROUP_ROUTES.UPLOAD_IMAGE, application_1.upload.single("groupImage"), groupController.uploadProfile.bind(groupController));
    return router;
};
exports.groupRoutes = groupRoutes;
