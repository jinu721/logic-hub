"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRoutes = void 0;
const express_1 = require("express");
const _middlewares_1 = require("../../../shared/middlewares");
const _constants_1 = require("../../../shared/constants");
const reportRoutes = (container) => {
    const router = (0, express_1.Router)();
    const reportController = container.reportCtrl;
    router.use(_middlewares_1.authMiddleware);
    router.post(_constants_1.REPORT_ROUTES.BASE, reportController.createReport.bind(reportController));
    router.get(_constants_1.REPORT_ROUTES.BASE, reportController.getAllReports.bind(reportController));
    router.get(_constants_1.REPORT_ROUTES.BY_ID, reportController.getReportById.bind(reportController));
    router.patch(_constants_1.REPORT_ROUTES.STATUS, reportController.updateReportStatus.bind(reportController));
    return router;
};
exports.reportRoutes = reportRoutes;
