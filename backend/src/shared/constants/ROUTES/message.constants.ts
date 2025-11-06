import { COMMON_ROUTES } from "./commen.routes";

export const MESSAGE_ROUTES = {
  BASE: COMMON_ROUTES.BASE,
  EDIT: COMMON_ROUTES.BASE,
  DELETE: "/:messageId",
  REACTION: {
    ADD: "/reaction",
    REMOVE: "/reaction",
  },
  SEEN: "/seen",
  BY_ID: "/:messageId",
  UPLOAD: "/upload",
};