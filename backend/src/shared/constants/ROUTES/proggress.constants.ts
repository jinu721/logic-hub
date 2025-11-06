import { COMMON_ROUTES } from "./commen.routes";

export const PROGRESS_ROUTES = {
  BASE: COMMON_ROUTES.BASE,
  BY_ID: "/:id",
  UPDATE: "/:id",
  DELETE: "/:id",
  BY_USER: "/user/:username",
  RECENT_BY_USER: "/recent/user/:input",
  BY_CHALLENGE: "/challenge/:challengeId",
  HEATMAP: "/user/heatmap/:userId",
  BY_USER_AND_CHALLENGE: "/user/:userId/challenge/:challengeId",
};