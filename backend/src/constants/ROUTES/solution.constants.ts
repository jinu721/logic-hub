import { COMMON_ROUTES } from "./commen.routes";

export const SOLUTION_ROUTES = {
  BASE: COMMON_ROUTES.BASE,
  BY_CHALLENGE: "/challenge/:challengeId",
  BY_USER: "/user/:userId",
  LIKE: "/:solutionId/like",
  COMMENT: "/:solutionId/comment",
  DELETE_COMMENT: "/:solutionId/comment/:commentId",
  UPDATE: "/:solutionId",
  DELETE: "/:solutionId",
};