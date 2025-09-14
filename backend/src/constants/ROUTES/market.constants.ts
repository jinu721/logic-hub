import { COMMON_ROUTES } from "./commen.routes";

export const MARKET_ROUTES = {
  BASE: COMMON_ROUTES.BASE,
  CREATE: COMMON_ROUTES.BASE,
  UPDATE: "/:id",
  DELETE: "/:id",
  PURCHASE: "/:id/purchase",
  GET_ALL: COMMON_ROUTES.BASE,
  GET_BY_ID: "/:id",
};