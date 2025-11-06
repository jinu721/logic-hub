import { Router } from "express";
import { authMiddleware } from "@middlewares";
import { PROGRESS_ROUTES } from "@constants";
import { Container } from "@di";


export const submissionRoutes = (container: Container) => {
    const router = Router();

    const submissionController = container.submissionCtrl;

    router.use(authMiddleware);

    router.post(PROGRESS_ROUTES.BASE, submissionController.createSubmission.bind(submissionController));
    router.get(PROGRESS_ROUTES.BASE, submissionController.getAllSubmissions.bind(submissionController));
    router.get(PROGRESS_ROUTES.BY_ID, submissionController.getSubmissionById.bind(submissionController));
    router.put(PROGRESS_ROUTES.UPDATE, submissionController.updateSubmission.bind(submissionController));
    router.delete(PROGRESS_ROUTES.DELETE, submissionController.deleteSubmission.bind(submissionController));
    router.get(PROGRESS_ROUTES.BY_USER, submissionController.getAllSubmissionsByUser.bind(submissionController));
    router.get(PROGRESS_ROUTES.RECENT_BY_USER, submissionController.getRecentSubmissions.bind(submissionController));
    router.get(PROGRESS_ROUTES.BY_CHALLENGE, submissionController.getAllSubmissionsByChallenge.bind(submissionController));
    router.get(PROGRESS_ROUTES.HEATMAP, submissionController.getHeatmap.bind(submissionController));
    router.get(PROGRESS_ROUTES.BY_USER_AND_CHALLENGE, submissionController.getSubmissionsByUserAndChallenge.bind(submissionController));

    return router;
}

