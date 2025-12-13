import { COMMON_ROUTES } from "./commen.routes";

export const CHALLENGE_ROUTES = {
  BASE: COMMON_ROUTES.BASE,
  CREATE: COMMON_ROUTES.BASE,
  GET_ALL: "/all",
  BY_ID: "/:challengeId",
  UPDATE: "/:challengeId",
  DELETE: "/:challengeId",
  BY_STATUS: "/status/:status",
  BY_TAGS: "/tags",
  BY_DIFFICULTY: "/difficulty/:difficulty",
  RUN_CODE: "/run",
  SUBMIT: "/submit",
};