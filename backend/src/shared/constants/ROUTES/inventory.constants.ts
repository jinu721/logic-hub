import { COMMON_ROUTES } from "./commen.routes";

export const INVENTORY_ROUTES = {
  BASE: COMMON_ROUTES.BASE,
  BY_TYPE: "/:type",
  BY_ID: "/:type/:id",
};
