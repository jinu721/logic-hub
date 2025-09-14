import { COMMON_ROUTES } from "./commen.routes";

export const MEMBERSHIP_ROUTES = {
  BASE: COMMON_ROUTES.BASE,
  GET_ALL: COMMON_ROUTES.BASE,
  ACTIVE: "/active",
  BY_ID: "/:id",
  UPDATE: "/:id",
  DELETE: "/:id",
};