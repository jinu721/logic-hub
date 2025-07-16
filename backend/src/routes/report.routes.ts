import { Router } from "express";
import { ReportController } from "../controllers/implements/report.controller";
import { ReportService } from "../services/implements/report.service";
import { ReportRepository } from "../repository/implements/report.repository";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

const reportController = new ReportController(
  new ReportService(new ReportRepository())
);

router.use(authMiddleware);

router.post("/", reportController.createReport.bind(reportController));
router.get("/", reportController.getAllReports.bind(reportController));
router.get("/:id", reportController.getReportById.bind(reportController));
router.patch("/:id/status", reportController.updateReportStatus.bind(reportController));

export default router;
