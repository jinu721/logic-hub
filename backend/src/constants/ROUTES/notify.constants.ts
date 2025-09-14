import { COMMON_ROUTES } from "./commen.routes";

export const NOTIFICATION_ROUTES = {
  BASE: COMMON_ROUTES.BASE,
  BY_ID: "/:id",
  UPDATE: "/:id",
  DELETE: "/:id",
  USER_ME: "/user/me",
  MARK_ALL: "/mark/all",
  DELETE_ALL: "/delete/all/:userId",
  TOGGLE_USER: "/toggle/user",
};