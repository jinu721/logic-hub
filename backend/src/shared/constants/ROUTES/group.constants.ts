import { COMMON_ROUTES } from "./commen.routes";

export const GROUP_ROUTES = {
  BASE: COMMON_ROUTES.BASE,
  BY_USER: "/:userId",
  UPDATE: "/:groupId",
  DELETE: "/:groupId",
  GET_ALL: COMMON_ROUTES.BASE,
  JOIN_REQUEST: "/:groupId/join-request",
  UPLOAD_IMAGE: "/image",
};