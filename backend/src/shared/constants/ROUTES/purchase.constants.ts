import { COMMON_ROUTES } from "./commen.routes";

export const PURCHASE_ROUTES = {
  CREATE_ORDER: "/create-order",
  CREATE_MEMBERSHIP: COMMON_ROUTES.BASE,
  HISTORY_BY_ID: "/history/:id",
  HISTORY: "/history",
  USER_HISTORY: "/:userId",
};