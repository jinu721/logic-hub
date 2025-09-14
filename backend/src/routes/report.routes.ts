import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { REPORT_ROUTES } from "../constants/ROUTES/report.constants";
import { container } from "../di/container";

const router = Router();

const reportController = container.reportCtrl;

router.use(authMiddleware);

router.post(REPORT_ROUTES.BASE, reportController.createReport.bind(reportController));
router.get(REPORT_ROUTES.BASE, reportController.getAllReports.bind(reportController));
router.get(REPORT_ROUTES.BY_ID, reportController.getReportById.bind(reportController));
router.patch(REPORT_ROUTES.STATUS, reportController.updateReportStatus.bind(reportController));


export default router;
