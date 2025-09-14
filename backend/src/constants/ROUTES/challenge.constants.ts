import { COMMON_ROUTES } from "./commen.routes";

export const CHALLENGE_ROUTES = {
  BASE: COMMON_ROUTES.BASE,
  CREATE: COMMON_ROUTES.BASE,
  GET_ALL: COMMON_ROUTES.BASE,   
  BY_ID: "/:id",
  UPDATE: "/:id",
  DELETE: "/:id",
  BY_STATUS: "/status/:status",
  BY_TAGS: "/tags",
  BY_DIFFICULTY: "/difficulty/:difficulty",
  RUN_CODE: "/run",
  SUBMIT: "/submit",
};