"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateUser = void 0;
const populateUser = (query) => {
    return query
        .populate("avatar")
        .populate("banner")
        .populate("inventory.ownedAvatars")
        .populate("inventory.ownedBanners")
        .populate("inventory.badges")
        .populate("membership.planId");
};
exports.populateUser = populateUser;
