"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHALLENGE_ROUTES = void 0;
const commen_routes_1 = require("./commen.routes");
exports.CHALLENGE_ROUTES = {
    BASE: commen_routes_1.COMMON_ROUTES.BASE,
    CREATE: commen_routes_1.COMMON_ROUTES.BASE,
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
