import { COMMON_ROUTES } from "./commen.routes";

export const LEVEL_ROUTES = {
  BASE: COMMON_ROUTES.BASE,
  BY_ID: "/:id",
  UPDATE: "/:id",
  DELETE: "/:id",
  USER_XP: "/user/:userId/xp",
};