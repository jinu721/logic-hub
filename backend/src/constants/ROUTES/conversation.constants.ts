import { COMMON_ROUTES } from "./commen.routes";

export const CONVERSATION_ROUTES = {
  BASE: COMMON_ROUTES.BASE,
  BY_GROUP: "/by-group/:groupId",
  USER_DATA: "/user/:id/data",
  ONE_TO_ONE: "/:userA/:userB",
  CREATE_ONE_TO_ONE: COMMON_ROUTES.BASE,
  FIND_CONVERSATION: "/:conversationId",

  TYPING: {
    SET: COMMON_ROUTES.TYPING,
    REMOVE: COMMON_ROUTES.TYPING,
    GET_USERS: `${COMMON_ROUTES.TYPING}/:conversationId`,
  },
};