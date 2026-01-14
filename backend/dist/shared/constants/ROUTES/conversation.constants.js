"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONVERSATION_ROUTES = void 0;
const commen_routes_1 = require("./commen.routes");
exports.CONVERSATION_ROUTES = {
    BASE: commen_routes_1.COMMON_ROUTES.BASE,
    BY_GROUP: "/by-group/:groupId",
    USER_DATA: "/user/:id/data",
    ONE_TO_ONE: "/:userA/:userB",
    CREATE_ONE_TO_ONE: commen_routes_1.COMMON_ROUTES.BASE,
    FIND_CONVERSATION: "/:conversationId",
    TYPING: {
        SET: commen_routes_1.COMMON_ROUTES.TYPING,
        REMOVE: commen_routes_1.COMMON_ROUTES.TYPING,
        GET_USERS: `${commen_routes_1.COMMON_ROUTES.TYPING}/:conversationId`,
    },
};
